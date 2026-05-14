const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASS,
  {
    host: process.env.HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  },
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database Connected");
  } catch (err) {
    console.error("DB Error:", err);
  }
};

module.exports = { sequelize, connectDB };
