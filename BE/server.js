// import package
require("dotenv").config();
const express = require("express");
// import model
// import router

const app = express();

const db = require("./src/config/db");

const auditRouter = require("./src/router/auditRouter");

app.get("/", (req, res) => {
  res.json("hello");
});

app.use("/api/audit", auditRouter);

// ─── Database Connection ────────────────────────────────────
db.authenticate()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.warn(
      "DB connection failed (running without DB):",
      err.message,
    );
  });

db.sync({ alter: true })
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.warn("DB sync failed:", err.message);
  });

// ─── Server Boot ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});