const express = require("express");
const router = express().route();
const authController = require("../controller/authController");
router.post("/login", authController.login);
router.post("/register", authController.register);

module.exports = router;