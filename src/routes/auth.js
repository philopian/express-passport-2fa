require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const prisma = require("../util/prisma");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        isTwoFactorAuthEnabled: false,
      },
    });

    const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;
    const accessToken = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: "10m" });
    const refreshToken = jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

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

    const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;
    const accessToken = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: "10m" });
    const refreshToken = jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

    return res.json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
