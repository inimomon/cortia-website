const Transaction = require("../model/Transaction");
const { Op } = require("sequelize");

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

const getProjectsByProvince = async (req, res) => {
  try {
    const { daerah } = req.params;

    if (!daerah) {
      return res.status(400).json({
        success: false,
        message: "Parameter daerah tidak boleh kosong",
      });
    }

    const rows = await Transaction.findAll({
      order: [["score", "DESC"]],
      limit: 100,
    });

    const filtered = rows.filter(
      (item) => normalizeText(item.nama_daerah) === normalizeText(daerah),
    );

    const mapped = filtered.map((item) => ({
      id: item.id,
      nama_daerah: item.nama_daerah,
      tender_title: item.tender_title,
      tender_minvalue: item.tender_minvalue,
      award_value: item.award_value,
      harga_awal: item.harga_awal,
      harga_final: item.harga_final,
      gap_harga: item.gap_harga,
      score: item.score,
      risk_level: item.risk_level,
      explanation: item.explanation,
      category: item.mainprocurementcategory || item.category,
      mainprocurementcategory: item.mainprocurementcategory,
      created_at: item.created_at,
    }));

    return res.status(200).json({
      success: true,
      total: mapped.length,
      data: mapped,
    });
  } catch (error) {
    console.error("GET PROJECTS BY PROVINCE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProjectDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Transaction.findByPk(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("GET PROJECT DETAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProjectsByProvince,
  getProjectDetail,
};