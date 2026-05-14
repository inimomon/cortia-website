const express = require("express");
const router = express.Router();
const {
  getAllData,
  getProvinceSummaries,
  getProvinceDetail,
} = require("../controller/predictionController");

router.get("/summary", getProvinceSummaries);
router.get("/province/:provinceKey", getProvinceDetail);
router.get("/", getAllData);

module.exports = router
