const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Transaction = sequelize.define(
  'transaction',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    audit_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    transaction_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sender: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    receiver: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    nama_daerah: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    award_date: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    tender_minvalue: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    award_value: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    tender_title: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    award_title: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    award_supplier: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    days_to_award: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mainprocurementcategory: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    risk_level: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    risk_score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    risk_category: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
      defaultValue: 'LOW',
    },
    risk_flags: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: 'transactions',
  }
);

module.exports = Transaction;
