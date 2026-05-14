const Prediction = require("../model/Prediction");
const db = require("../config/db");
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


module.exports = {
    getAllData,
}
