const express = require("express");
const router = express.Router();

const auditController = require("../controller/auditController");

router.post("/upload", auditController.uploadFile);
router.post("/manual", auditController.analyzeManualInput);

router.get("/", auditController.getAudits);
router.get("/template", auditController.downloadTemplate);
router.get("/:id", auditController.getAuditDetail);
router.get("/:auditId/transaction/:txId", auditController.getTransactionDetail);

module.exports = router;
