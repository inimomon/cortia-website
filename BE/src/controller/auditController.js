const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

const AuditHistory = require('../model/AuditHistory');
const Transaction = require('../model/Transaction');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ['.xlsx', '.csv'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only .xlsx and .csv files are allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single('file');

const FASTAPI_PREDICT_FILE_URL =
  process.env.FASTAPI_DRAF_PREDICT_FILE_URL || 'http://127.0.0.1:8000/cortia/api/v1/predict_file';
const FASTAPI_TIMEOUT_MS = parseInt(process.env.FASTAPI_TIMEOUT_MS || '15000', 10);
const FLOW_TYPE = 'audit';
const REQUIRED_COLUMNS = [
  'tender_title',
  'tender_minvalue',
  'award_value',
  'award_date',
  'days_to_award',
  'mainprocurementcategory',
  'award_title',
  'award_supplier',
  'nama_daerah',
];

function parseFile(filePath) {
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(worksheet, { defval: null });

  return rows.map((row) => {
    const normalized = {};
    Object.keys(row).forEach((key) => {
      normalized[key.toLowerCase().replace(/\s+/g, '_')] = row[key];
    });
    return normalized;
  });
}

function formatAwardDate(value) {
  if (!value && value !== 0) return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (typeof value === 'number') {
    const parsed = xlsx.SSF.parse_date_code(value);
    if (parsed) {
      const date = new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
      return date.toISOString().slice(0, 10);
    }
  }
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);
  return '';
}

function validateSchema(rows, explicitNamaDaerah) {
  if (!rows.length) return { valid: false, message: 'File is empty' };

  const keys = new Set(rows.flatMap((row) => Object.keys(row)));
  const missing = REQUIRED_COLUMNS.filter((column) => column !== 'nama_daerah' && !keys.has(column));
  if (!explicitNamaDaerah && !keys.has('nama_daerah')) missing.push('nama_daerah');
  if (missing.length) {
    return { valid: false, message: `Missing required columns: ${missing.join(', ')}` };
  }

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const rowNumber = index + 2;
    const namaDaerah = explicitNamaDaerah || row.nama_daerah;

    if (!String(namaDaerah || '').trim()) {
      return { valid: false, message: `Row ${rowNumber}: nama_daerah is required` };
    }
    if (!String(row.tender_title || '').trim()) {
      return { valid: false, message: `Row ${rowNumber}: tender_title is required` };
    }
    if (!formatAwardDate(row.award_date)) {
      return { valid: false, message: `Row ${rowNumber}: award_date must be a valid date` };
    }

    const tenderMinvalue = Number(row.tender_minvalue);
    if (!Number.isFinite(tenderMinvalue) || tenderMinvalue < 0) {
      return { valid: false, message: `Row ${rowNumber}: tender_minvalue must be a valid number` };
    }
    const awardValue = Number(row.award_value);
    if (!Number.isFinite(awardValue) || awardValue < 0) {
      return { valid: false, message: `Row ${rowNumber}: award_value must be a valid number` };
    }
    const daysToAward = Number(row.days_to_award);
    if (!Number.isInteger(daysToAward) || daysToAward < 0) {
      return { valid: false, message: `Row ${rowNumber}: days_to_award must be a non-negative integer` };
    }

    const requiredTextFields = ['mainprocurementcategory', 'award_title', 'award_supplier'];
    const missingText = requiredTextFields.find((field) => !String(row[field] || '').trim());
    if (missingText) {
      return { valid: false, message: `Row ${rowNumber}: ${missingText} is required` };
    }
  }

  return { valid: true };
}

function resolveNamaDaerah(rows, explicitNamaDaerah) {
  if (explicitNamaDaerah) return String(explicitNamaDaerah).trim();
  const values = [...new Set(rows.map((row) => String(row.nama_daerah || '').trim()).filter(Boolean))];
  if (values.length !== 1) throw new Error('Uploaded data must contain exactly one nama_daerah value');
  return values[0];
}

function sanitizeRows(rows, namaDaerah) {
  return rows.map((row) => ({
    tender_title: String(row.tender_title || '').trim(),
    tender_minvalue: Number(row.tender_minvalue),
    award_value: Number(row.award_value),
    award_date: formatAwardDate(row.award_date),
    days_to_award: Number(row.days_to_award),
    mainprocurementcategory: String(row.mainprocurementcategory || '').trim(),
    award_title: String(row.award_title || '').trim(),
    award_supplier: String(row.award_supplier || '').trim(),
    nama_daerah: namaDaerah,
  }));
}

function csvEscape(value) {
  const stringValue = value === null || value === undefined ? '' : String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function buildPredictionCsv(rows) {
  const body = rows.map((row) => REQUIRED_COLUMNS.map((header) => csvEscape(row[header])).join(','));
  return [REQUIRED_COLUMNS.join(','), ...body].join('\n');
}

async function requestFastApiPrediction(namaDaerah, rows, auditId) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FASTAPI_TIMEOUT_MS);

  try {
    const form = new FormData();
    form.append('daerah', namaDaerah);
    form.append('nama_daerah', namaDaerah);
    if (auditId !== undefined && auditId !== null) form.append('audit_id', String(auditId));
    form.append('file', new Blob([buildPredictionCsv(rows)], { type: 'text/csv' }), 'audit_old_rows.csv');

    const response = await fetch(FASTAPI_PREDICT_FILE_URL, {
      method: 'POST',
      body: form,
      signal: controller.signal,
    });

    const rawText = await response.text();
    let data;
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      data = { detail: rawText || 'Invalid response from FastAPI service' };
    }

    if (!response.ok) {
      const error = new Error(
        data.detail || data.message || `FastAPI request failed with status ${response.status}`
      );
      error.statusCode = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error('FastAPI prediction request timed out');
      timeoutError.statusCode = 504;
      throw timeoutError;
    }
    if (error.cause?.code === 'ECONNREFUSED' || error.code === 'ECONNREFUSED') {
      const unavailableError = new Error('FastAPI prediction service is unavailable');
      unavailableError.statusCode = 503;
      throw unavailableError;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function summarisePredictionResults(results) {
  return results.reduce(
    (summary, item) => {
      const level = String(item.risk_level || '').toLowerCase();
      if (level === 'high') summary.high_risk += 1;
      else if (level === 'medium') summary.medium_risk += 1;
      else summary.low_risk += 1;
      return summary;
    },
    { high_risk: 0, medium_risk: 0, low_risk: 0, total_processed: results.length }
  );
}

//untuk upload file input dari user bukan input kasar
const uploadFile = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) return res.status(400).json({ success: false, message: err.message });
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    try {
      const rows = parseFile(req.file.path);
      const explicitNamaDaerah = req.body?.nama_daerah ? String(req.body.nama_daerah).trim() : '';
      const validation = validateSchema(rows, explicitNamaDaerah);

      if (!validation.valid) {
        fs.unlinkSync(req.file.path);
        return res.status(422).json({ success: false, message: validation.message });
      }

      const audit = await AuditHistory.create({
        file_id: path.basename(req.file.path, path.extname(req.file.path)),
        filename: req.file.originalname,
        total_rows: rows.length,
        status: 'pending',
        flow_type: FLOW_TYPE,
      });

      const newPath = path.join(uploadDir, `audit_old_${audit.id}${path.extname(req.file.path)}`);
      fs.renameSync(req.file.path, newPath);
      await AuditHistory.update({ file_id: `audit_old_${audit.id}` }, { where: { id: audit.id } });

      return res.json({
        success: true,
        fileId: `audit_old_${audit.id}`,
        auditId: audit.id,
        rows: rows.length,
        filename: req.file.originalname,
      });
    } catch (error) {
      console.error('Upload old error:', error);
      return res.status(500).json({ success: false, message: 'Server error during upload' });
    }
  });
};

//contoh dummy untuk user (ttemplate contoh dalam xlsx)
const downloadTemplate = (_req, res) => {
  const workbook = xlsx.utils.book_new();
  const sampleData = [
    {
      tender_title: 'Jasa Eo Pemilihan Abang Dan None Jakarta Selatan Tahun 2023',
      tender_minvalue: 1252306428.2,
      award_value: 1145627700.0,
      award_date: '2023-04-14',
      days_to_award: 11,
      mainprocurementcategory: 'Services',
      award_title: 'Jasa Eo Pemilihan Abang Dan None Jakarta Selatan Tahun 2023',
      award_supplier: 'Pt. Ishana Abyakta Indonesia',
      nama_daerah: 'dki_jakarta_127',
    },
    {
      tender_title: 'Pengadaan Perangkat Jaringan Data Pemerintah Kota',
      tender_minvalue: 875000000.0,
      award_value: 842500000.0,
      award_date: '2023-05-02',
      days_to_award: 19,
      mainprocurementcategory: 'Goods',
      award_title: 'Kontrak Pengadaan Perangkat Jaringan Data Pemerintah Kota',
      award_supplier: 'PT Nusantara Teknologi Infrastruktur',
      nama_daerah: 'dki_jakarta_127',
    },
  ];

  const worksheet = xlsx.utils.json_to_sheet(sampleData);
  worksheet['!cols'] = [
    { wch: 45 }, { wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 14 },
    { wch: 24 }, { wch: 45 }, { wch: 30 }, { wch: 18 },
  ];
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Template');
  const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  res.setHeader('Content-Disposition', 'attachment; filename="audit_old_template.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
};

// clean data from user input, panggil fastapi 
const analyzeAudit = async (req, res) => {
  const { auditId } = req.body;
  if (!auditId) return res.status(400).json({ success: false, message: 'auditId is required' });

  try {
    const audit = await AuditHistory.findByPk(auditId);
    if (!audit || audit.flow_type !== FLOW_TYPE) {
      return res.status(404).json({ success: false, message: 'Audit not found' });
    }
    if (audit.status === 'processing') {
      return res.status(409).json({ success: false, message: 'Analysis already in progress' });
    }
    if (audit.status === 'completed') {
      return res.status(409).json({ success: false, message: 'This file has already been analyzed' });
    }

    await AuditHistory.update({ status: 'processing' }, { where: { id: auditId } });

    const ext = ['.xlsx', '.csv'].find((candidate) =>
      fs.existsSync(path.join(uploadDir, `audit_old_${auditId}${candidate}`))
    );
    if (!ext) {
      await AuditHistory.update({ status: 'failed' }, { where: { id: auditId } });
      return res.status(404).json({ success: false, message: 'Uploaded file not found on server' });
    }

    const rows = parseFile(path.join(uploadDir, `audit_old_${auditId}${ext}`));
    const validation = validateSchema(rows);
    if (!validation.valid) {
      await AuditHistory.update({ status: 'failed' }, { where: { id: auditId } });
      return res.status(422).json({ success: false, message: validation.message });
    }

    const namaDaerah = resolveNamaDaerah(rows);
    const sanitizedRows = sanitizeRows(rows, namaDaerah);
    const predictionResponse = await requestFastApiPrediction(namaDaerah, sanitizedRows, auditId);
    if (!Array.isArray(predictionResponse.results)) {
      throw new Error('FastAPI response does not contain a results array');
    }

    const summary = summarisePredictionResults(predictionResponse.results);

    await AuditHistory.update(
      {
        status: 'completed',
        total_rows: summary.total_processed,
        high_risk: summary.high_risk,
        medium_risk: summary.medium_risk,
        low_risk: summary.low_risk,
      },
      { where: { id: auditId } }
    );

    return res.json({
      success: true,
      status: predictionResponse.status || 'success',
      total_processed: summary.total_processed,
      results: predictionResponse.results,
      summary,
    });
  } catch (error) {
    console.error('Analyze old error:', error);
    await AuditHistory.update({ status: 'failed' }, { where: { id: auditId } }).catch(() => {});
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getAudits = async (req, res) => {
  try {
    const { q, risk, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const where = { flow_type: FLOW_TYPE };
    const txWhere = {};

    if (q) {
      txWhere[Op.or] = [
        { tender_title: { [Op.like]: `%${q}%` } },
        { award_title: { [Op.like]: `%${q}%` } },
        { award_supplier: { [Op.like]: `%${q}%` } },
        { nama_daerah: { [Op.like]: `%${q}%` } },
      ];
    }
    if (risk && ['low', 'medium', 'high'].includes(String(risk).toLowerCase())) {
      txWhere.risk_level = String(risk).toLowerCase();
    }

    if (Object.keys(txWhere).length > 0) {
      const matchingTransactions = await Transaction.findAll({
        where: txWhere,
        attributes: ['audit_id'],
        group: ['audit_id'],
      });
      const auditIds = matchingTransactions.map((item) => item.audit_id);
      if (auditIds.length === 0) {
        return res.json({ success: true, data: [], total: 0, page: parseInt(page, 10) });
      }
      where.id = { [Op.in]: auditIds };
    }

    const { count, rows } = await AuditHistory.findAndCountAll({
      where,
      order: [['id', 'DESC']],
      limit: parseInt(limit, 10),
      offset,
    });

    return res.json({ success: true, data: rows, total: count, page: parseInt(page, 10) });
  } catch (error) {
    console.error('List old error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAuditDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const audit = await AuditHistory.findByPk(id);
    if (!audit || audit.flow_type !== FLOW_TYPE) {
      return res.status(404).json({ success: false, message: 'Audit not found' });
    }
    const transactions = await Transaction.findAll({
      where: { audit_id: id },
      order: [['score', 'DESC']],
    });
    return res.json({ success: true, audit, transactions });
  } catch (error) {
    console.error('Detail old error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getTransactionDetail = async (req, res) => {
  const { auditId, txId } = req.params;
  try {
    const transaction = await Transaction.findOne({ where: { audit_id: auditId, id: txId } });
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    return res.json({ success: true, transaction });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadFile,
  downloadTemplate,
  analyzeAudit,
  getAudits,
  getAuditDetail,
  getTransactionDetail,
};
