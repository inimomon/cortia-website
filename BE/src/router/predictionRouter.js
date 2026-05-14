const express = require("express");
const router = express.Router();
const {getAllData} = require("../controller/predictionController");

router.get("/", getAllData);

module.exports = router