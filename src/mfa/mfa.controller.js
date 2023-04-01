const express = require("express");
const passport = require("passport");
const { authenticator } = require("otplib");

const mfaService = require("./mfa.service");
const usersService = require("../users/users.service");
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
    console.log("🚀 ~ file: mfa.controller.js:43 ~ router.post ~ user:", user);
    if (!user) return res.status(401).send({ message: "Unauthorized: Invalid user" });

    // Make sure that MFA is enabled for this user in the DB
    const { isMfaAuthEnabled, id } = user;
    if (!isMfaAuthEnabled) return res.status(426).send({ message: "Upgrade Required: mfa not enabled" });

    // // Check to see if user exists
    // const userInDb = await usersService.findUniqueUserFromId({ id });
    // if (!userInDb) return res.status(404).send({ message: "Not Found: User not found" });

    // // MFA Code
    // const { code } = req.body;
    // if (!code) return res.status(400).send({ message: "Bad Request: missing mfa code" });

    // // If valid mint tokens
    // const mfaValid = authenticator.verify({ token: code, secret: user.mfaFactorAuthSecret });
    // // const mfaValid = authenticator.verify({ token: code, secret: "PRVHI22YPQNQS23P" });

    // if (mfaValid) {
    //   // issue JWT token
    //   const tokens = await authService.mintTokens({ id });
    //   return res.send(tokens);
    // } else {
    //   return res.status(401).send({ message: "Invalid mfa code" });
    // }
    const { accessToken, refreshToken } = await authService.mintTokens({ id });

    return res.json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
