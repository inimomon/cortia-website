const Prediction = require("../model/Prediction");
const { Sequelize } = require("sequelize");
const getAllData = async (req, res) => {
  try {
    const data = await Prediction.findAll();

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
const getPredictionStats = async (req, res) => {
  try {
    const { daerah } = req.params;

    const stats = await Prediction.findOne({
      attributes: [
        "daerah",

        [Sequelize.fn("COUNT", Sequelize.col("id")), "total_data"],

        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(`
              CASE WHEN risk_level = 'high' THEN 1 ELSE 0 END
            `),
          ),
          "danger",
        ],

        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(`
              CASE WHEN risk_level = 'medium' THEN 1 ELSE 0 END
            `),
          ),
          "warning",
        ],

        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(`
              CASE WHEN risk_level = 'low' THEN 1 ELSE 0 END
            `),
          ),
          "safe",
        ],

        [Sequelize.fn("AVG", Sequelize.col("score")), "avg_score"],
        [Sequelize.fn("SUM", Sequelize.col("harga_awal")), "total_anggaran"],
        [Sequelize.fn("SUM", Sequelize.col("harga_final")), "total_final"],
        [
          Sequelize.fn("SUM", Sequelize.fn("ABS", Sequelize.col("gap_harga"))),
          "total_gap",
        ],
      ],

      where: { daerah },
      group: ["daerah"],
      raw: true,
    });

    return res.json({
      success: true,
      data: stats || {
        daerah,
        total_data: 0,
        danger: 0,
        warning: 0,
        safe: 0,
        avg_score: 0,
        total_anggaran: 0,
        total_final: 0,
        total_gap: 0,
      },
    });
  } catch (error) {
    console.error("GET PREDICTION STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
module.exports = {
  getAllData,
  getPredictionStats,
};
