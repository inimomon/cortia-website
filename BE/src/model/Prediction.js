const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Prediction = sequelize.define(
  "prediction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    daerah: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },

    tender_title: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },

    score: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
    },

    risk_level: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },

    harga_awal: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null,
    },

    harga_final: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null,
    },

    gap_harga: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null,
    },

    tgl_pagu_launch: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },

    tgl_terima_pagu: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },

    tgl_terima_count_pagu: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },

    explanation: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: false,
    tableName: "predictions",
  },
);

module.exports = Prediction;
