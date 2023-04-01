require("dotenv").config();
const bcrypt = require("bcryptjs");
// const { authenticator } = require("otplib");

const prisma = require("../util/prisma");

async function createNewUser({ email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  // const mfaFactorAuthSecret = authenticator.generateSecret();

  // genMfaSecret();

  const user = await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
      isMfaAuthEnabled: true, // MFA enable by default
      hashedRefreshToken: undefined,
      // TODO: create JWT fingerprint
    },
  });
  return user;
}

async function findUniqueUserFromId({ id }) {
  const user = await prisma.users.findUnique({ where: { id } });
  return user;
}

async function findUniqueUserFromEmail({ email }) {
  const user = await prisma.users.findUnique({ where: { email } });
  return user;
}

async function comparePasswords({ password, hashedPassword }) {
  const passwordMatch = await bcrypt.compare(password, hashedPassword);
  return passwordMatch;
}

// async function createMfaSecret({ userId }) {
//   // Add MFA secret to DB
//   const mfaSecret = authenticator.generateSecret();
//   await prisma.users.update({
//     data: {
//       // With Prisma when a field is assigned undefined it means ignore this and do nothing for this field.
//       id: undefined,
//       email: undefined,
//       password: undefined,
//       isMfaAuthEnabled: undefined,
//       mfaFactorAuthSecret: mfaSecret,
//       hashedRefreshToken: undefined,
//     },
//     where: { id: userId },
//   });

//   return { mfaSecret };
// }

async function removeRefreshToken({ email }) {
  await prisma.users.update({
    data: {
      // With Prisma when a field is assigned undefined it means ignore this and do nothing for this field.
      id: undefined,
      email: undefined,
      password: undefined,
      isMfaAuthEnabled: undefined,
      hashedRefreshToken: null,
    },
    where: { email },
  });

  return true;
}

module.exports = {
  createNewUser,
  findUniqueUserFromId,
  findUniqueUserFromEmail,
  comparePasswords,
  // createMfaSecret,
  removeRefreshToken,
};
