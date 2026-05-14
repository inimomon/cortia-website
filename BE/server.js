// import package
require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");

// import model
require("./src/model/Prediction");
require("./src/model/User");
require("./src/model/AuditHistory");

// import router
const predictionRouter = require("../BE/src/router/predictionRouter");
const authRouter = require("./src/router/authRouter");
const auditRouter = require("./src/router/auditRouter");

const app = express();

app.use(express.json());

// use router
app.use("/api/v1/prediction", predictionRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/audit", auditRouter);

app.get("/", (req, res) => {
  res.json("hello");
});

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`running in http://localhost:${process.env.PORT}`);
});
