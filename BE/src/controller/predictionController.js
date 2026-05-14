const Prediction = require("../model/Prediction");
const { Sequelize } = require("sequelize");

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

  return (
    String(value)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "tidak-diketahui"
  );
};

const statusFromRisk = (riskLevel) => {
  if (riskLevel === "high") return "KRITIS";
  if (riskLevel === "medium") return "ANOMALI";
  return "STABIL";
};

const categoryLabel = (value) => {
  if (!value) return "Tanpa Kategori";
  return String(value).trim();
};

const formatCompactCurrency = (value) => {
  const number = toNumber(value);

  if (number >= 1_000_000_000_000) {
    return `Rp ${(number / 1_000_000_000_000).toFixed(1)}T`;
  }

  if (number >= 1_000_000_000) {
    return `Rp ${(number / 1_000_000_000).toFixed(1)}M`;
  }

  if (number >= 1_000_000) {
    return `Rp ${(number / 1_000_000).toFixed(1)}Jt`;
  }

  return `Rp ${number.toLocaleString("id-ID")}`;
};

const buildProvinceSummary = (provinceName, rows) => {
  const totalAnggaran = rows.reduce(
    (sum, row) => sum + toNumber(row.harga_awal || row.harga_final),
    0,
  );

  const averageScore =
    rows.length > 0
      ? rows.reduce((sum, row) => sum + toNumber(row.score), 0) / rows.length
      : 0;

  const riskCounts = rows.reduce(
    (acc, row) => {
      const key = String(row.risk_level || "low").toLowerCase();
      if (acc[key] !== undefined) acc[key] += 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0 },
  );

  const categoryCounts = rows.reduce((acc, row) => {
    const key = categoryLabel(row.category);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const categoryBreakdown = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({
      name,
      count,
      percentage: rows.length ? Math.round((count / rows.length) * 100) : 0,
    }));

  const dominantRisk =
    riskCounts.high > 0 ? "high" : riskCounts.medium > 0 ? "medium" : "low";

  return {
    key: toProvinceKey(provinceName),
    daerah: provinceName,
    status: statusFromRisk(dominantRisk),
    riskLevel: dominantRisk,
    totalAnggaran,
    totalAnggaranFormatted: formatCompactCurrency(totalAnggaran),
    totalProyek: rows.length,
    skorAnomali: Number((averageScore * 10).toFixed(1)),
    riskCounts,
    categoryBreakdown,
  };
};

const getAllData = async (_req, res) => {
  try {
    const data = await Prediction.findAll({
      order: [["created_at", "DESC"]],
    });

    return res.json(data);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

const getProvinceSummaries = async (_req, res) => {
  try {
    const rows = await Prediction.findAll({
      raw: true,
      order: [["created_at", "DESC"]],
    });

    const grouped = rows.reduce((acc, row) => {
      const provinceName = normalizeProvinceName(row.daerah);

      if (!acc[provinceName]) acc[provinceName] = [];
      acc[provinceName].push(row);

      return acc;
    }, {});

    const summaries = Object.entries(grouped)
      .map(([provinceName, provinceRows]) =>
        buildProvinceSummary(provinceName, provinceRows),
      )
      .sort((a, b) => b.skorAnomali - a.skorAnomali);

    return res.json({
      success: true,
      data: summaries,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const getPredictionStats = async (req, res) => {
  try {
    const { daerah } = req.params;

    const stats = await Prediction.findOne({
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("id")), "total_data"],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              "CASE WHEN risk_level = 'high' THEN 1 ELSE 0 END",
            ),
          ),
          "danger",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              "CASE WHEN risk_level = 'medium' THEN 1 ELSE 0 END",
            ),
          ),
          "warning",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal("CASE WHEN risk_level = 'low' THEN 1 ELSE 0 END"),
          ),
          "safe",
        ],
        [Sequelize.fn("AVG", Sequelize.col("score")), "avg_score"],
        [Sequelize.fn("SUM", Sequelize.col("harga_awal")), "total_anggaran"],
        [Sequelize.fn("SUM", Sequelize.col("harga_final")), "total_final"],
      ],
      where: { daerah },
      raw: true,
    });

    return res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getAllData,
  getPredictionStats,
  getProvinceSummaries,
};
