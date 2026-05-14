const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

const AuditHistory = require("../model/AuditHistory");
const Transaction = require("../model/Transaction");

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const FASTAPI_PREDICT_FILE_URL =
  process.env.FASTAPI_PREDICT_FILE_URL ||
  "http://127.0.0.1:8000/cortia/api/v1/predict_file";

const FASTAPI_INPUT_TEXT_URL =
  process.env.FASTAPI_INPUT_TEXT_URL ||
  "http://127.0.0.1:8000/cortia/api/v1/input_text";

const FASTAPI_TIMEOUT_MS = Number(process.env.FASTAPI_TIMEOUT_MS || 30000);
const FLOW_TYPE = "audit";

const REQUIRED_COLUMNS = [
  "tender_title",
  "tender_minvalue",
  "award_value",
  "award_date",
  "days_to_award",
  "mainprocurementcategory",
  "award_title",
  "award_supplier",
  "nama_daerah",
];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".xlsx", ".csv"].includes(ext)) cb(null, true);
    else cb(new Error("Only .xlsx and .csv files are allowed"), false);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("file");

function formatAwardDate(value) {
  if (!value && value !== 0) return "";

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "number") {
    const parsed = xlsx.SSF.parse_date_code(value);
    if (parsed) {
      const date = new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
      return date.toISOString().slice(0, 10);
    }
  }

  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);

  return "";
}

function parseFile(filePath) {
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(worksheet, { defval: null });

  return rows.map((row) => {
    const normalized = {};
    Object.keys(row).forEach((key) => {
      normalized[key.toLowerCase().replace(/\s+/g, "_")] = row[key];
    });
    return normalized;
  });
}

function validateRows(rows, explicitNamaDaerah = "") {
  if (!rows.length) return { valid: false, message: "File kosong" };

  const keys = new Set(rows.flatMap((row) => Object.keys(row)));

  const missing = REQUIRED_COLUMNS.filter(
    (column) => column !== "nama_daerah" && !keys.has(column),
  );

  if (!explicitNamaDaerah && !keys.has("nama_daerah")) {
    missing.push("nama_daerah");
  }

  if (missing.length) {
    return {
      valid: false,
      message: `Kolom wajib hilang: ${missing.join(", ")}`,
    };
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNumber = i + 2;
    const namaDaerah = explicitNamaDaerah || row.nama_daerah;

    if (!String(namaDaerah || "").trim()) {
      return { valid: false, message: `Baris ${rowNumber}: nama_daerah wajib` };
    }

    if (!String(row.tender_title || "").trim()) {
      return {
        valid: false,
        message: `Baris ${rowNumber}: tender_title wajib`,
      };
    }

    if (!formatAwardDate(row.award_date)) {
      return {
        valid: false,
        message: `Baris ${rowNumber}: award_date tidak valid`,
      };
    }

    if (!Number.isFinite(Number(row.tender_minvalue))) {
      return {
        valid: false,
        message: `Baris ${rowNumber}: tender_minvalue tidak valid`,
      };
    }

    if (!Number.isFinite(Number(row.award_value))) {
      return {
        valid: false,
        message: `Baris ${rowNumber}: award_value tidak valid`,
      };
    }

    if (!Number.isInteger(Number(row.days_to_award))) {
      return {
        valid: false,
        message: `Baris ${rowNumber}: days_to_award harus angka bulat`,
      };
    }

    for (const field of [
      "mainprocurementcategory",
      "award_title",
      "award_supplier",
    ]) {
      if (!String(row[field] || "").trim()) {
        return { valid: false, message: `Baris ${rowNumber}: ${field} wajib` };
      }
    }
  }

  return { valid: true };
}

function validateManual(body) {
  const missing = REQUIRED_COLUMNS.find(
    (column) => !String(body[column] || "").trim(),
  );

  if (missing) return { valid: false, message: `${missing} wajib diisi` };

  if (!formatAwardDate(body.award_date)) {
    return { valid: false, message: "award_date tidak valid" };
  }

  if (!Number.isFinite(Number(body.tender_minvalue))) {
    return { valid: false, message: "tender_minvalue tidak valid" };
  }

  if (!Number.isFinite(Number(body.award_value))) {
    return { valid: false, message: "award_value tidak valid" };
  }

  if (!Number.isInteger(Number(body.days_to_award))) {
    return { valid: false, message: "days_to_award harus angka bulat" };
  }

  return { valid: true };
}

function resolveNamaDaerah(rows, explicitNamaDaerah = "") {
  if (explicitNamaDaerah) return String(explicitNamaDaerah).trim();

  const unique = [
    ...new Set(
      rows.map((row) => String(row.nama_daerah || "").trim()).filter(Boolean),
    ),
  ];

  if (unique.length !== 1) {
    throw new Error("File harus memiliki tepat 1 nama_daerah");
  }

  return unique[0];
}

function sanitizeRows(rows, namaDaerah) {
  return rows.map((row) => ({
    tender_title: String(row.tender_title || "").trim(),
    tender_minvalue: Number(row.tender_minvalue),
    award_value: Number(row.award_value),
    award_date: formatAwardDate(row.award_date),
    days_to_award: Number(row.days_to_award),
    mainprocurementcategory: String(row.mainprocurementcategory || "").trim(),
    award_title: String(row.award_title || "").trim(),
    award_supplier: String(row.award_supplier || "").trim(),
    nama_daerah: namaDaerah,
  }));
}

function sanitizeManual(body) {
  const namaDaerah = String(body.nama_daerah || "").trim();

  return {
    daerah: namaDaerah,
    nama_daerah: namaDaerah,
    tender_title: String(body.tender_title || "").trim(),
    tender_minvalue: Number(body.tender_minvalue),
    award_value: Number(body.award_value),
    award_date: formatAwardDate(body.award_date),
    days_to_award: Number(body.days_to_award),
    mainprocurementcategory: String(body.mainprocurementcategory || "").trim(),
    award_title: String(body.award_title || "").trim(),
    award_supplier: String(body.award_supplier || "").trim(),
  };
}

function csvEscape(value) {
  const str = value === null || value === undefined ? "" : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

function buildCsv(rows) {
  const body = rows.map((row) =>
    REQUIRED_COLUMNS.map((col) => csvEscape(row[col])).join(","),
  );

  return [REQUIRED_COLUMNS.join(","), ...body].join("\n");
}

async function readFastApiResponse(response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { detail: text || "Invalid FastAPI response" };
  }
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FASTAPI_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function requestFastApiInputText(payload) {
  const response = await fetchWithTimeout(FASTAPI_INPUT_TEXT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await readFastApiResponse(response);

  if (!response.ok) {
    const message =
      typeof data.detail === "string"
        ? data.detail
        : data.detail?.message || data.message || "FastAPI input_text gagal";

    const error = new Error(message);
    error.statusCode = response.status;
    throw error;
  }

  return data;
}

async function requestFastApiPredictFile(namaDaerah, rows, auditId) {
  const form = new FormData();

  form.append("daerah", namaDaerah);
  form.append("nama_daerah", namaDaerah);
  form.append("audit_id", String(auditId));

  form.append(
    "file",
    new Blob([buildCsv(rows)], { type: "text/csv" }),
    "audit_rows.csv",
  );

  const response = await fetchWithTimeout(FASTAPI_PREDICT_FILE_URL, {
    method: "POST",
    body: form,
  });

  const data = await readFastApiResponse(response);

  if (!response.ok) {
    const message =
      typeof data.detail === "string"
        ? data.detail
        : data.detail?.message || data.message || "FastAPI predict_file gagal";

    const error = new Error(message);
    error.statusCode = response.status;
    throw error;
  }

  return data;
}

function summarize(results) {
  return results.reduce(
    (acc, item) => {
      const level = String(item.risk_level || "").toLowerCase();

      if (level === "high") acc.high_risk += 1;
      else if (level === "medium") acc.medium_risk += 1;
      else acc.low_risk += 1;

      return acc;
    },
    {
      high_risk: 0,
      medium_risk: 0,
      low_risk: 0,
      total_processed: results.length,
    },
  );
}

async function insertTransactions(auditId, namaDaerah, rows, results) {
  const transactionRows = results.map((item, index) => {
    const original = rows[index];

    return {
      audit_id: auditId,
      nama_daerah: namaDaerah,

      tender_title: original.tender_title,
      tender_minvalue: original.tender_minvalue,
      award_value: original.award_value,
      award_date: original.award_date,
      days_to_award: original.days_to_award,
      mainprocurementcategory: original.mainprocurementcategory,
      award_title: original.award_title,
      award_supplier: original.award_supplier,

      score: item.score,
      risk_level: item.risk_level,
      explanation: item.explanation,
    };
  });

  await Transaction.bulkCreate(transactionRows);
}

const uploadFile = (req, res) => {
  upload(req, res, async (err) => {
    let audit = null;

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File belum diupload",
      });
    }

    try {
      const rows = parseFile(req.file.path);

      const explicitNamaDaerah = req.body?.nama_daerah
        ? String(req.body.nama_daerah).trim()
        : "";

      const validation = validateRows(rows, explicitNamaDaerah);

      if (!validation.valid) {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

        return res.status(422).json({
          success: false,
          message: validation.message,
        });
      }

      const namaDaerah = resolveNamaDaerah(rows, explicitNamaDaerah);
      const sanitizedRows = sanitizeRows(rows, namaDaerah);

      audit = await AuditHistory.create({
        file_id: `upload_${Date.now()}`,
        filename: req.file.originalname,
        total_rows: sanitizedRows.length,
        status: "processing",
        flow_type: FLOW_TYPE,
      });

      const fastApiResult = await requestFastApiPredictFile(
        namaDaerah,
        sanitizedRows,
        audit.id,
      );

      if (!Array.isArray(fastApiResult.results)) {
        throw new Error("FastAPI tidak mengembalikan results array");
      }

      await insertTransactions(
        audit.id,
        namaDaerah,
        sanitizedRows,
        fastApiResult.results,
      );

      const summary = summarize(fastApiResult.results);

      await AuditHistory.update(
        {
          status: "completed",
          total_rows: summary.total_processed,
          high_risk: summary.high_risk,
          medium_risk: summary.medium_risk,
          low_risk: summary.low_risk,
        },
        { where: { id: audit.id } },
      );

      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

      return res.json({
        success: true,
        source: "predict_file",
        auditId: audit.id,
        filename: req.file.originalname,
        rows: summary.total_processed,
        summary,
        results: fastApiResult.results,
      });
    } catch (error) {
      console.error("UPLOAD ANALYZE ERROR:", error);

      if (audit?.id) {
        await AuditHistory.update(
          { status: "failed" },
          { where: { id: audit.id } },
        ).catch(() => {});
      }

      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  });
};

const analyzeManualInput = async (req, res) => {
  try {
    const validation = validateManual(req.body);

    if (!validation.valid) {
      return res.status(422).json({
        success: false,
        message: validation.message,
      });
    }

    const payload = sanitizeManual(req.body);
    const result = await requestFastApiInputText(payload);

    const riskLevel = String(result.risk_level || "low").toLowerCase();

    const summary = {
      high_risk: riskLevel === "high" ? 1 : 0,
      medium_risk: riskLevel === "medium" ? 1 : 0,
      low_risk: riskLevel === "low" ? 1 : 0,
      total_processed: 1,
    };

    const audit = await AuditHistory.create({
      file_id: `manual_${Date.now()}`,
      filename: "Manual Input",
      total_rows: 1,
      status: "completed",
      flow_type: FLOW_TYPE,
      high_risk: summary.high_risk,
      medium_risk: summary.medium_risk,
      low_risk: summary.low_risk,
    });

    await Transaction.create({
      audit_id: audit.id,
      nama_daerah: payload.nama_daerah,

      tender_title: payload.tender_title,
      tender_minvalue: payload.tender_minvalue,
      award_value: payload.award_value,
      award_date: payload.award_date,
      days_to_award: payload.days_to_award,
      mainprocurementcategory: payload.mainprocurementcategory,
      award_title: payload.award_title,
      award_supplier: payload.award_supplier,

      score: result.score,
      risk_level: result.risk_level,
      explanation: result.explanation,
    });

    return res.json({
      success: true,
      source: "input_text",
      auditId: audit.id,
      result,
      summary,
    });
  } catch (error) {
    console.error("Manual input error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const downloadTemplate = (_req, res) => {
  const workbook = xlsx.utils.book_new();

  const sampleData = [
    {
      nama_daerah: "DKI Jakarta",
      tender_title:
        "Jasa EO Pemilihan Abang Dan None Jakarta Selatan Tahun 2023",
      tender_minvalue: 1252306428.2,
      award_value: 1145627700,
      award_date: "2023-04-14",
      days_to_award: 11,
      mainprocurementcategory: "Services",
      award_title:
        "Jasa EO Pemilihan Abang Dan None Jakarta Selatan Tahun 2023",
      award_supplier: "PT Ishana Abyakta Indonesia",
    },
  ];

  const worksheet = xlsx.utils.json_to_sheet(sampleData);
  xlsx.utils.book_append_sheet(workbook, worksheet, "Template");

  const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });

  res.setHeader(
    "Content-Disposition",
    'attachment; filename="audit_old_template.xlsx"',
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );

  res.send(buffer);
};

const getAudits = async (req, res) => {
  try {
    const { q, risk, page = 1, limit = 10 } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
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

    if (risk && ["low", "medium", "high"].includes(String(risk))) {
      txWhere.risk_level = String(risk);
    }

    if (Object.keys(txWhere).length > 0) {
      const txs = await Transaction.findAll({
        where: txWhere,
        attributes: ["audit_id"],
        group: ["audit_id"],
      });

      const auditIds = txs.map((item) => item.audit_id);

      if (!auditIds.length) {
        return res.json({
          success: true,
          data: [],
          total: 0,
          page: Number(page),
        });
      }

      where.id = { [Op.in]: auditIds };
    }

    const { count, rows } = await AuditHistory.findAndCountAll({
      where,
      order: [["id", "DESC"]],
      limit: Number(limit),
      offset,
    });

    const auditIds = rows.map((item) => item.id);

    const firstTransactions = await Transaction.findAll({
      where: {
        audit_id: {
          [Op.in]: auditIds,
        },
      },
      attributes: ["id", "audit_id"],
      order: [["id", "DESC"]],
    });

    const transactionMap = {};

    firstTransactions.forEach((tx) => {
      if (!transactionMap[tx.audit_id]) {
        transactionMap[tx.audit_id] = tx.id;
      }
    });

    const formatted = rows.map((item) => {
      const json = item.toJSON();

      return {
        ...json,
        transaction_id: transactionMap[json.id] || null,
      };
    });

    return res.json({
      success: true,
      data: formatted,
      total: count,
      page: Number(page),
    });
  } catch (error) {
    console.error("List old error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAuditDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction tidak ditemukan",
      });
    }

    return res.json({
      success: true,
      audit: {
        id: transaction.audit_id,
        transaction_id: transaction.id,
      },
      transactions: [transaction],
    });
  } catch (error) {
    console.error("Detail transaction error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTransactionDetail = async (req, res) => {
  const { auditId, txId } = req.params;

  try {
    const transaction = await Transaction.findOne({
      where: {
        audit_id: auditId,
        id: txId,
      },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction tidak ditemukan",
      });
    }

    return res.json({
      success: true,
      transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadFile,
  analyzeManualInput,
  downloadTemplate,
  getAudits,
  getAuditDetail,
  getTransactionDetail,
};
