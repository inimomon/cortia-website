// import package
require("dotenv").config();
const express = require("express");
// import model
// import router

const app = express();

app.get("/", (req, res) => {
  res.json("hello");
});

app.listen(process.env.PORT, () => {
  console.log(`runing in http://localhost:${process.env.PORT}`);
});
