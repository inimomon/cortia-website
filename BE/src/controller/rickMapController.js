const { sequelize } = require("../config/db");

const RiskMap = require("../model/Riskmap");

const syncRiskMap = async () => {
  await sequelize.query(`
    INSERT INTO risk_map_summary (
      daerah,
      index_resiko,
      count_warning,
      count_danger,
      count_safe,
      total_data,
      total_alokasi,
      total_alokasi_final,
      last_updated
    )

    SELECT 
      daerah,

      AVG(COALESCE(score,0) * 100),

      SUM(CASE WHEN risk_level = 'medium' THEN 1 ELSE 0 END),

      SUM(CASE WHEN risk_level = 'high' THEN 1 ELSE 0 END),

      SUM(CASE WHEN risk_level = 'low' THEN 1 ELSE 0 END),

      COUNT(*),

      SUM(harga_awal),

      SUM(harga_final),

      NOW()

    FROM predictions

    GROUP BY daerah

    ON DUPLICATE KEY UPDATE
      index_resiko = VALUES(index_resiko),
      count_warning = VALUES(count_warning),
      count_danger = VALUES(count_danger),
      count_safe = VALUES(count_safe),
      total_data = VALUES(total_data),
      total_alokasi = VALUES(total_alokasi),
      total_alokasi_final = VALUES(total_alokasi_final),
      last_updated = VALUES(last_updated)
  `);
};

const getRiskMap = async (req, res) => {
  try {
    await syncRiskMap();

    const allData = await RiskMap.findAll();

    if (allData.length === 0) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const formattedData = allData.map((item) => {
      const json = item.toJSON();

      const danger = Number(json.count_danger || 0);
      const warning = Number(json.count_warning || 0);
      const safe = Number(json.count_safe || 0);
      const total = Number(json.total_data || 0);

      const dangerRate = total > 0 ? danger / total : 0;
      const warningRate = total > 0 ? warning / total : 0;
      const safeRate = total > 0 ? safe / total : 0;
      const riskScore = (dangerRate * 0.7 + warningRate * 0.3) * 100;

      let status = "SAFE";
      let color = "green";

      if (riskScore >= 15) {
        status = "DANGER";
        color = "red";
      } else if (riskScore >= 7) {
        status = "WARNING";
        color = "yellow";
      }

      return {
        ...json,

        index_resiko: Number(riskScore.toFixed(2)),

        heatmap_status: status,
        heatmap_color: color,

        percentage: {
          danger_rate: Number((dangerRate * 100).toFixed(2)),
          warning_rate: Number((warningRate * 100).toFixed(2)),
          safe_rate: Number((safeRate * 100).toFixed(2)),
        },
      };
    });

    formattedData.sort((a, b) => b.index_resiko - a.index_resiko);

    return res.json({
      success: true,
      data: formattedData,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  getRiskMap,
  syncRiskMap,
};