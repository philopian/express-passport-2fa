require("dotenv").config();

const { PORT } = process.env;

const baseSwagger = {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "ExpressJS with Passport JWT and MFA",
  },
  servers: [
    {
      url: `http://localhost:${PORT}/`,
    },
  ],
};
const swagger = {
  ...baseSwagger,
  paths: {
    ...require("./api/api.swagger.json").paths,
    ...require("./auth/auth.swagger.json").paths,
    ...require("./mfa/mfa.swagger.json").paths,
    ...require("./posts/posts.swagger.json").paths,
  },
  components: {
    securityDefinitions: {
      BearerAuth: {
        type: "apiKey",
        in: "header",
      },
    },
    securitySchemes: {
      JWT: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

module.exports = {
  corsOptions: {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: [process.env.LOCAL_CLIENT_URL, `http://localhost:${PORT}/`],
    preflightContinue: false,
  },
  jwtStrategy: {
    defaultJwt: "jwt",
    login: "login",
    googleAuthenticatorQr: "google-authenticatorQr",
    googleAuthenticator: "google-authenticator",
    refreshJwt: "jwt-refresh",
  },
  swagger,
};
