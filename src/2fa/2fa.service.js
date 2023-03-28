require("dotenv").config();
const qrcode = require("qrcode");
const { authenticator } = require("otplib");

async function genQRCode({ email, mfaSecret }) {
  const { APP_NAME } = process.env;

  // generate QR code for 2FA
  const otpauthUrl = authenticator.keyuri(email, APP_NAME, mfaSecret);
  return otpauthUrl;
}

async function resStreamQrCode({ res, otpauthUrl }) {
  await qrcode.toFileStream(res, otpauthUrl);
}

module.exports = {
  genQRCode,
  resStreamQrCode,
};
