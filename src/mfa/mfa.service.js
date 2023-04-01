require("dotenv").config();
const qrcode = require("qrcode");
const { authenticator } = require("otplib");

async function genQRCode({ email }) {
  const { APP_NAME, MFA_SECRET } = process.env;

  // generate QR code for MFA
  const otpauthUrl = authenticator.keyuri(email, APP_NAME, MFA_SECRET);
  return otpauthUrl;
}

async function resStreamQrCode({ res, otpauthUrl }) {
  await qrcode.toFileStream(res, otpauthUrl);
}

module.exports = {
  genQRCode,
  resStreamQrCode,
};
