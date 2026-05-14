const express = require('express');
const router = express.Router();
const {
    uploadFile,
    downloadTemplate,
    analyzeAudit,
    getAudits,
    getAuditDetail,
    getTransactionDetail,
} = require('../controller/auditController');

router.post('/upload', uploadFile);
router.get('/template', downloadTemplate);
router.post('/analyze', analyzeAudit);
router.get('/', getAudits);
router.get('/:id', getAuditDetail);
router.get('/:auditId/transaction/:txId', getTransactionDetail);

module.exports = router;
