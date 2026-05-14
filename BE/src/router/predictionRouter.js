const express = require("express");
const router = express().route();
const {getAllData} = require("../controller/predictionController");

router.get("/", getAllData);

module.exports = router