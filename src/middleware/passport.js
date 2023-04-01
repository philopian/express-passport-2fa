require("dotenv").config();
const passport = require("passport");
const passportJWT = require("passport-jwt");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const { authenticator } = require("otplib");

const prisma = require("../util/prisma");

const JwtStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const config = require("../config");

const { jwtStrategy } = config;

// Local Strategy
passport.use(
  jwtStrategy.login,
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email, password, done) => {
      try {
        // Check to see if user exist in DB
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) return done(null, false);

        // Check to see if the password matches
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return done(null, false);

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  jwtStrategy.defaultJwt,
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await prisma.users.findUnique({ where: { id: jwtPayload.sub } });
        if (!user) return done(null, false);

        // *NOTE*: MAYBE Force user to have to MFA with Google Authenticator
        // if (!jwtPayload.mfaValid) return done(null, false);
        // *NOTE*: MAYBE Force user to have to MFA with Google Authenticator

        return done(null, { ...user, mfaValid: jwtPayload.mfaValid });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  jwtStrategy.googleAuthenticatorQr,
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_MFA_SECRET,
    },
    async (jwtPayload, done) => {
      console.log("🚀 ~ file: passport.js:72 ~ jwtPayload:", jwtPayload);
      try {
        const user = await prisma.users.findUnique({ where: { id: jwtPayload.sub } });
        if (!user) return done(null, false);
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  jwtStrategy.googleAuthenticator,
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_MFA_SECRET,
      passReqToCallback: true,
    },

    async (req, jwtPayload, done) => {
      console.log("🚀 ~ file: passport.js:97 ~ req:", req.body);
      console.log("🚀 ~ file: passport.js:72 ~ jwtPayload:", jwtPayload);
      try {
        // Verify user exist in the DB
        const user = await prisma.users.findUnique({ where: { id: jwtPayload.sub } });
        if (!user) return done(null, false);

        // Make sure the MFA code is passed in
        const { code } = req.body;
        if (!code) return done(null, false);

        // Verify with authenticator
        const { MFA_SECRET } = process.env;
        const mfaValid = authenticator.verify({ token: code, secret: MFA_SECRET });
        if (!mfaValid) return done(null, false);

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
