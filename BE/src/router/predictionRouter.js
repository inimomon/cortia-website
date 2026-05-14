const express = require("express");
const router = express.Router();
const {getAllData, getPredictionStats} = require("../controller/predictionController");

router.get("/", getAllData);
router.get("/stats/:daerah", getPredictionStats);
module.exports = router