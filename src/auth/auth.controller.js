const express = require("express");
const passport = require("passport");

const authService = require("../auth/auth.service");
const usersService = require("../users/users.service");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check to see if email doesn't already exist
    const userAlreadyExist = await usersService.findUniqueUserFromEmail({ email });
    if (userAlreadyExist) return res.status(409).json({ message: "Conflict: The email address is already registered" });

    // Create a new user
    const newUser = await usersService.createNewUser({ email, password });

    // Mint new tokens (and add hashed Refreshtoken)
    const { accessToken, refreshToken } = await authService.mintTokens({ id: newUser.id });

    return res.json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error: Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check to see if user with email exist
    const user = await usersService.findUniqueUserFromEmail({ email });
    if (!user) return res.status(401).json({ message: "Unauthorized: Invalid credentials" });

    // Check to see if password matched hashed password
    const passwordMatch = await usersService.comparePasswords({ password, hashedPassword: user.password });
    if (!passwordMatch) return res.status(401).json({ message: "Unauthorized: Invalid credentials" });

    // Mint tokens
    const { accessToken, refreshToken } = await authService.mintTokens({ id: user.id });

    return res.json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error: Something went wrong" });
  }
});

router.get("/logout", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const { user } = req;

    const userIsLoggedOut = usersService.removeRefreshToken({ email: user.email });

    if (userIsLoggedOut) return res.status(404).json({ message: "User is logged out!" });
    throw new error("couldn't logout");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error: Something went wrong" });
  }
});

module.exports = router;
