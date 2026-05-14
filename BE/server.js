// import package
require("dotenv").config();
const express = require("express");
const { connectDB, sequelize } = require("./src/config/db");
const cors = require("cors");
// import model
require("./src/model/Prediction");
require("./src/model/User");
require("./src/model/AuditHistory");
require("./src/model/Transaction");
require("./src/model/Riskmap");

// import router
const predictionRouter = require("./src/router/predictionRouter");
const authRouter = require("./src/router/authRouter");
const auditRouter = require("./src/router/auditRouter");
const riskMapRouter = require("./src/router/riskMapRouter");
const transactionRoute = require("./src/router/trancactionRouter");
const app = express();

app.use(cors());
app.use(express.json());

// use router
app.use("/api/v1/prediction", predictionRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/audit", auditRouter);
app.use("/api/v1/riskMap", riskMapRouter);
app.use("/api/v1/transaction", transactionRoute);

app.get("/", (req, res) => {
  res.json("hello");
});

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync();

    console.log("Database synced");

    app.listen(process.env.PORT, () => {
      console.log(`running in http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
