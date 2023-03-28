require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const otplib = require("otplib");

const prisma = require("../util/prisma");

const { authenticator } = otplib;
const router = express.Router();

function mintTokens({ id }) {
  const { JWT_SECRET, JWT_REFRESH_SECRET, JWT_TOKEN_EXPIRATION, JWT_REFRESH_TOKEN_EXPIRATION } = process.env;
  const accessToken = jwt.sign({ sub: id }, JWT_SECRET, { expiresIn: JWT_TOKEN_EXPIRATION });
  const refreshToken = jwt.sign({ sub: id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRATION });
  return { accessToken, refreshToken };
}

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Generate a secret key for the user's OTP token
  const twoFactorAuthSecret = authenticator.generateSecret();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        isTwoFactorAuthEnabled: true,
        twoFactorAuthSecret,
      },
    });

    // const { JWT_SECRET, JWT_REFRESH_SECRET, JWT_TOKEN_EXPIRATION, JWT_REFRESH_TOKEN_EXPIRATION } = process.env;
    // const accessToken = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_TOKEN_EXPIRATION });
    // const refreshToken = jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRATION });
    const { accessToken, refreshToken } = mintTokens({ id: user.id });

    return res.json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // const { JWT_SECRET, JWT_REFRESH_SECRET, JWT_TOKEN_EXPIRATION, JWT_REFRESH_TOKEN_EXPIRATION } = process.env;
    // const accessToken = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_TOKEN_EXPIRATION });
    // const refreshToken = jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRATION });
    const { accessToken, refreshToken } = mintTokens({ id: user.id });

    return res.json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
