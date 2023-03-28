require("dotenv").config();
const bcrypt = require("bcryptjs");
const { authenticator } = require("otplib");

const prisma = require("../util/prisma");

async function createNewUser({ email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const mfaSecret = authenticator.generateSecret();

  const user = await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
      isTwoFactorAuthEnabled: true,
      twoFactorAuthSecret: mfaSecret,
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

async function createMfaSecret({ userId }) {
  // Add 2FA secret to DB
  const mfaSecret = authenticator.generateSecret();
  await prisma.users.update({
    data: {
      // With Prisma when a field is assigned undefined it means ignore this and do nothing for this field.
      id: undefined,
      email: undefined,
      password: undefined,
      isTwoFactorAuthEnabled: undefined,
      twoFactorAuthSecret: mfaSecret,
      hashedRefreshToken: undefined,
    },
    where: { id: userId },
  });

  return { mfaSecret };
}

async function removeRefreshToken({ email }) {
  await prisma.users.update({
    data: {
      // With Prisma when a field is assigned undefined it means ignore this and do nothing for this field.
      id: undefined,
      email: undefined,
      password: undefined,
      isTwoFactorAuthEnabled: undefined,
      twoFactorAuthSecret: undefined,
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
  createMfaSecret,
  removeRefreshToken,
};
