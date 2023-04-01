require("dotenv").config();

module.exports = {
  corsOptions: {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: process.env.LOCAL_CLIENT_URL,
    preflightContinue: false,
  },
  jwtStrategy: {
    defaultJwt: "jwt",
    login: "login",
    googleAuthenticatorQr: "google-authenticatorQr",
    googleAuthenticator: "google-authenticator",
    refreshJwt: "jwt-refresh",
  },
};
