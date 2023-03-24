require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");

const config = require("./config");
const authRoutes = require("./routes/auth");

const port = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors(config.corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
require("./passport");

app.use("/auth", authRoutes);

app.get("/api/open", (req, res) => {
  res.json({ message: "This route is open" });
});

app.get("/api/protected", passport.authenticate("jwt", { session: false }), (req, res) => {
  const { id, email } = req.user;
  res.json({ message: "This route is protected", user: { id, email } });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
