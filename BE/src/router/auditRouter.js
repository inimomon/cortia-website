const express = require('express');
const router = express.Router();
const {
    uploadFile,
    downloadTemplate,
    analyzeAudit
} = require('../controller/auditController');

router.post('/upload', uploadFile);
router.get('/template', downloadTemplate);
router.post('/analyze', analyzeAudit);

module.exports = router;
