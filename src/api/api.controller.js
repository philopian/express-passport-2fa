const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/open", async (req, res) => {
  res.json({ message: "This route is open" });
});

router.get("/protected", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { id, email, mfaValid } = req.user;
  // *NOTE*: Or maybe just check per route it MFA is completed??
  if (!mfaValid) return res.status(403).json({ message: "Forbidden: make sure you MFA with Google Authenticator" });

  res.json({ message: "This route is protected", user: { id, email, mfaValid } });
});

module.exports = router;
