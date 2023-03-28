require("dotenv").config();
const passport = require("passport");
const passportJWT = require("passport-jwt");
// const LocalStrategy = require("passport-local").Strategy;

const prisma = require("../util/prisma");

const JwtStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// // Local Strategy
// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//       session: false,
//     },
//     (email, password, done) => {
//       User.findOne({ email: email })
//         .then((user) => {
//           if (!user) {
//             return done(null, false, { message: "Incorrect email." });
//           }
//           if (!user.validPassword(password)) {
//             return done(null, false, { message: "Incorrect password." });
//           }
//           return done(null, user);
//         })
//         .catch((err) => done(err));
//     }
//   )
// );

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await prisma.users.findUnique({ where: { id: jwtPayload.sub } });
        if (!user) return done(null, false);

        // *NOTE*: MAYBE Force user to have to 2FA with Google Authenticator
        // if (!jwtPayload.mfaValid) return done(null, false);
        // *NOTE*: MAYBE Force user to have to 2FA with Google Authenticator

        return done(null, { ...user, mfaValid: jwtPayload.mfaValid });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  "google-authenticator",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
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
