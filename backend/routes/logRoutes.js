const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const LogSchema = new mongoose.Schema({
  keyword: String,
  site: String,
  rank: Number,
  timestamp: Number,
});

const Log = mongoose.model("Log", LogSchema);

router.post("/logs", async (req, res) => {
  try {
    const log = new Log(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save log" });
  }
});

module.exports = router;
