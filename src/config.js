require("dotenv").config();

module.exports = {
  corsOptions: {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: process.env.LOCAL_CLIENT_URL,
    preflightContinue: false,
  },
};
