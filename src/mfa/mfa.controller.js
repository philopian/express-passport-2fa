const express = require("express");
const passport = require("passport");

const mfaService = require("./mfa.service");
const authService = require("../auth/auth.service");
const config = require("../config");

const { jwtStrategy } = config;

const router = express.Router();

router.get(
  "/qrcode",
  passport.authenticate(jwtStrategy.googleAuthenticatorQr, { session: false }),
  async (req, res) => {
    try {
      const { user } = req;
      if (!user) return res.status(401).send({ message: "Unauthorized" });

      if (user.isMfaAuthEnabled) {
        const { id, email } = user;

        // Create QR Code
        const otpauthUrl = await mfaService.genQRCode({ email });

        // Return a QR Code
        mfaService.resStreamQrCode({ res, otpauthUrl });
      } else {
        return res.status(426).json({ error: "Upgrade Required: mfa is not enabled" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
);

router.post("/verify", passport.authenticate(jwtStrategy.googleAuthenticator, { session: false }), async (req, res) => {
  try {
    const { user } = req;
    if (!user) return res.status(401).send({ message: "Unauthorized: Invalid user" });

    // Make sure that MFA is enabled for this user in the DB
    const { isMfaAuthEnabled, id } = user;
    if (!isMfaAuthEnabled) return res.status(426).send({ message: "Upgrade Required: mfa not enabled" });

    const { accessToken, refreshToken } = await authService.mintTokens({ id });

    return res.json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
