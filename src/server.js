require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const config = require("./config");
const authRoutes = require("./auth/auth.controller");
const twofaRoutes = require("./mfa/mfa.controller");
const apiRoutes = require("./api/api.controller");

const port = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors(config.corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
require("./middleware/passport");

// Routes
app.use("/auth", authRoutes);
app.use("/mfa", twofaRoutes);
app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
