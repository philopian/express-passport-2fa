require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = require("../util/prisma");

async function mintTokens({ id }) {
  const {
    JWT_MFA_SECRET,
    JWT_MFA_TOKEN_EXPIRATION,
    JWT_SECRET,
    JWT_REFRESH_SECRET,
    JWT_TOKEN_EXPIRATION,
    JWT_REFRESH_TOKEN_EXPIRATION,
  } = process.env;

  const mfaJwtPayload = {
    sub: id,

    mfaValid: false,
  };

  const jwtPayload = {
    sub: id,
    mfaValid: true,
  };

  // *NOTE: `mfaToken` => JWT without the `mfaValid` payload property, (only for login then ask user to MFA)
  const mfaToken = jwt.sign(mfaJwtPayload, JWT_MFA_SECRET, { expiresIn: JWT_MFA_TOKEN_EXPIRATION });
  const accessToken = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: JWT_TOKEN_EXPIRATION });
  const refreshToken = jwt.sign(jwtPayload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRATION });

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  await prisma.users.update({
    data: {
      // With Prisma when a field is assigned undefined it means ignore this and do nothing for this field.
      id: undefined,
      email: undefined,
      name: undefined,
      password: undefined,
      isMfaAuthEnabled: undefined,
      hashedRefreshToken,
    },
    where: { id },
  });

  return { mfaToken, accessToken, refreshToken };
}

async function decodeJwt({ token }) {
  const { JWT_SECRET } = process.env;
  const decoded = await jwt.verify(token, JWT_SECRET);
  return decoded;
}

module.exports = {
  mintTokens,
  decodeJwt,
};
