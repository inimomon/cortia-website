const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    nik: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },

    nama_panjang: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    tgl_lahir: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    no_hp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "user",
    timestamps: false,
  },
);

module.exports = User;
