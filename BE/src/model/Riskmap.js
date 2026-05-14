// models/RiskMapSummary.js
const { DataTypes } = require("sequelize");
const { sequelize }= require("../config/db");

const RiskMapSummary = sequelize.define(
  "RiskMapSummary",
  {
    daerah: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      allowNull: false,
    },
    index_resiko: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    count_warning: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    count_danger: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    count_safe: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_data: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_alokasi: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    total_alokasi_final: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    last_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "risk_map_summary",
    timestamps: false,
  },
);

module.exports = RiskMapSummary;
