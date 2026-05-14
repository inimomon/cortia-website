const express = require('express');
const router = express.Router();
const {
    uploadFile,
} = require('../controller/auditController');

router.post('/upload', uploadFile);

module.exports = router;
