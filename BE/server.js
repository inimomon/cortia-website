// import package
require("dotenv").config();
const express = require("express");
const {connectDB, sequelize} = require("./src/config/db");
// import model
const predictionModel = require("./src/model/Prediction");
// import router
const predictionRouter = require("./src/controller/predictionController");
const app = express();

// use router
app.use("/api/v1/prediction")
app.get("/", (req, res) => {
  res.json("hello");
});

app.listen(process.env.PORT, () => {
  console.log(`runing in http://localhost:${process.env.PORT}`);
});
