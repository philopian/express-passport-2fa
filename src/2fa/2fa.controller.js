const express = require("express");
const passport = require("passport");
const { authenticator } = require("otplib");

const mfaService = require("./2fa.service");
const usersService = require("../users/users.service");
const authService = require("../auth/auth.service");

const router = express.Router();

router.post("/qrcode", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const { user } = req;
    if (!user) return res.status(401).send({ message: "Invalid email or password" });

    if (user.isTwoFactorAuthEnabled) {
      const { id, email } = user;

      // Create mfa secret & store in DB
      const { mfaSecret } = await usersService.createMfaSecret({ userId: id });

      // Create QR Code
      const otpauthUrl = await mfaService.genQRCode({ email, mfaSecret });

      // Return a QR Code
      mfaService.resStreamQrCode({ res, otpauthUrl });
    } else {
      return res.status(426).json({ error: "Upgrade Required: 2FA is not enabled" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/verify", passport.authenticate("google-authenticator", { session: false }), async (req, res) => {
  try {
    const { user } = req;
    if (!user) return res.status(401).send({ message: "Unauthorized: Invalid user" });

    // Make sure that MFA is enabled for this user in the DB
    const { isTwoFactorAuthEnabled, id } = user;
    if (!isTwoFactorAuthEnabled) return res.status(426).send({ message: "Upgrade Required: 2FA not enabled" });

    // Check to see if user exists
    const userInDb = await usersService.findUniqueUserFromId({ id });
    if (!userInDb) return res.status(404).send({ message: "Not Found: User not found" });

    // MFA Code
    const { code } = req.body;
    if (!code) return res.status(400).send({ message: "Bad Request: missing 2FA code" });

    // If valid mint tokens
    const mfaValid = authenticator.verify({ token: code, secret: user.twoFactorAuthSecret });
    if (mfaValid) {
      // issue JWT token
      const tokens = await authService.mintTokens({ id, mfaValid });
      return res.send(tokens);
    } else {
      return res.status(401).send({ message: "Invalid 2FA code" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
