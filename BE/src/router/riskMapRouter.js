const express = require("express");
const router = express.Router();

const { getRiskMap } = require("../controller/rickMapController");

router.get("/", getRiskMap);

module.exports = router;
