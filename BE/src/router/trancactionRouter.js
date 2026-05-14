const express = require("express");

const router = express.Router();

const {
  getProjectsByProvince,
  getProjectDetail,
} = require("../controller/transactionController");

router.get("/projects/:daerah", getProjectsByProvince);

router.get("/detail/:id", getProjectDetail);

module.exports = router;
