const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AuditHistory = sequelize.define(
    'audit_history',
    {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    file_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    total_rows: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    high_risk: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    medium_risk: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    low_risk: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
      defaultValue: 'pending',
    },
    flow_type: {
      type: DataTypes.STRING(30),
      defaultValue: 'audit',
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: 'audit_history',
  }
);

module.exports = AuditHistory;
