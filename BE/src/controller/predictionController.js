const Prediction = require("../model/Prediction");

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeProvinceName = (value) => {
  if (!value) return "Tidak Diketahui";

  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const toProvinceKey = (value) => {
  if (!value) return "tidak-diketahui";

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "tidak-diketahui";
};

const statusFromRisk = (riskLevel) => {
  if (riskLevel === "high") return "KRITIS";
  if (riskLevel === "medium") return "ANOMALI";
  return "STABIL";
};

const categoryLabel = (value) => {
  if (!value) return "Infrastruktur Lainnya";
  return String(value).trim();
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(toNumber(value));

const getExplanationItems = (text) => {
  if (!text) return [];

  const boldSegments = [...String(text).matchAll(/\*\*(.*?)\*\*/g)].map((match) => match[1]?.trim()).filter(Boolean);
  const sentenceParts = String(text)
    .split(/\n+/)
    .map((part) => part.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);

  const items = [];

  for (let index = 0; index < Math.min(3, sentenceParts.length); index += 1) {
    items.push({
      parameter: boldSegments[index] || `Parameter ${index + 1}`,
      insight: sentenceParts[index],
    });
  }

  return items;
};

const buildProvinceSummary = (provinceName, rows) => {
  const totalAnggaran = rows.reduce(
    (sum, row) => sum + toNumber(row.harga_awal || row.harga_final),
    0,
  );
  const totalAnomali = rows.reduce((sum, row) => sum + toNumber(row.harga_final), 0);
  const averageScore =
    rows.length > 0
      ? rows.reduce((sum, row) => sum + toNumber(row.score), 0) / rows.length
      : 0;

  const riskCounts = rows.reduce(
    (accumulator, row) => {
      const key = String(row.risk_level || "low").toLowerCase();
      if (accumulator[key] !== undefined) {
        accumulator[key] += 1;
      }
      return accumulator;
    },
    { high: 0, medium: 0, low: 0 },
  );

  const categoryCounts = rows.reduce((accumulator, row) => {
    const key = categoryLabel(row.category);
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  const categoryBreakdown = Object.entries(categoryCounts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([name, count]) => ({
      name,
      count,
      percentage: rows.length ? Math.round((count / rows.length) * 100) : 0,
    }));

  const strongestRow = [...rows].sort((left, right) => toNumber(right.score) - toNumber(left.score))[0] || null;
  const dominantRisk =
    riskCounts.high > 0 ? "high" : riskCounts.medium > 0 ? "medium" : "low";

  return {
    key: toProvinceKey(provinceName),
    daerah: provinceName,
    provinceName,
    status: statusFromRisk(dominantRisk),
    riskLevel: dominantRisk,
    totalAnggaran,
    totalAnggaranFormatted: formatCurrency(totalAnggaran),
    totalProyek: rows.length,
    danaAnomali: totalAnomali,
    danaAnomaliFormatted: formatCurrency(totalAnomali),
    skorAnomali: Number((averageScore * 10).toFixed(2)),
    riskCounts,
    categoryBreakdown,
    topProject: strongestRow
      ? {
          id: strongestRow.id,
          tender_title: strongestRow.tender_title,
          category: categoryLabel(strongestRow.category),
          harga_final: toNumber(strongestRow.harga_final),
          harga_final_formatted: formatCurrency(strongestRow.harga_final),
          score: toNumber(strongestRow.score),
          risk_level: strongestRow.risk_level,
          explanation: strongestRow.explanation,
          explanationItems: getExplanationItems(strongestRow.explanation),
        }
      : null,
  };
};

const getAllData = async (_req, res) => {
  try {
    const data = await Prediction.findAll({ order: [["created_at", "DESC"]] });
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const getProvinceSummaries = async (_req, res) => {
  try {
    const rows = await Prediction.findAll({ raw: true, order: [["created_at", "DESC"]] });
    const grouped = rows.reduce((accumulator, row) => {
      const provinceName = normalizeProvinceName(row.daerah);
      if (!accumulator[provinceName]) {
        accumulator[provinceName] = [];
      }
      accumulator[provinceName].push(row);
      return accumulator;
    }, {});

    const summaries = Object.entries(grouped)
      .map(([provinceName, provinceRows]) => buildProvinceSummary(provinceName, provinceRows))
      .sort((left, right) => right.skorAnomali - left.skorAnomali);

    res.json({
      success: true,
      data: summaries,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const getProvinceDetail = async (req, res) => {
  try {
    const provinceKey = req.params.provinceKey;
    const rows = await Prediction.findAll({ raw: true, order: [["score", "DESC"]] });
    const grouped = rows.reduce((accumulator, row) => {
      const provinceName = normalizeProvinceName(row.daerah);
      if (!accumulator[provinceName]) {
        accumulator[provinceName] = [];
      }
      accumulator[provinceName].push(row);
      return accumulator;
    }, {});

    const matchedEntry = Object.entries(grouped).find(([provinceName]) => toProvinceKey(provinceName) === provinceKey);

    if (!matchedEntry) {
      return res.status(404).json({
        success: false,
        message: "Detail provinsi tidak ditemukan.",
      });
    }

    const [provinceName, provinceRows] = matchedEntry;
    const summary = buildProvinceSummary(provinceName, provinceRows);
    const projects = provinceRows.map((row) => ({
      id: row.id,
      name: row.tender_title || "Tanpa Judul Proyek",
      category: categoryLabel(row.category),
      budget: toNumber(row.harga_final),
      budgetFormatted: formatCurrency(row.harga_final),
      status: statusFromRisk(String(row.risk_level || "").toLowerCase()),
      risk_level: row.risk_level,
      score: Number((toNumber(row.score) * 10).toFixed(2)),
      explanation: row.explanation,
      explanationItems: getExplanationItems(row.explanation),
      created_at: row.created_at,
      harga_awal: toNumber(row.harga_awal),
      harga_awal_formatted: formatCurrency(row.harga_awal),
      harga_final: toNumber(row.harga_final),
      harga_final_formatted: formatCurrency(row.harga_final),
      gap_harga: toNumber(row.gap_harga),
      gap_harga_formatted: formatCurrency(row.gap_harga),
      tender_title: row.tender_title,
    }));

    return res.json({
      success: true,
      data: {
        summary,
        projects,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  getAllData,
  getProvinceSummaries,
  getProvinceDetail,
};
