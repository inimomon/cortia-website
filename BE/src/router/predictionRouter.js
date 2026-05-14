const express = require("express");
const {
  getAllData,
  getPredictionStats,
  getProvinceSummaries,
} = require("../controller/predictionController");

const router = express.Router();

router.get("/", getAllData);
router.get("/summary", getProvinceSummaries);
router.get("/prediction/stats/:daerah", getPredictionStats);

module.exports = router;
