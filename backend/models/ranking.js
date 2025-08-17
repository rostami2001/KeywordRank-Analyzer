const mongoose = require("mongoose");

const RankingSchema = new mongoose.Schema({
  site: String,
  keyword: String,
  rank: Number,
  timestamp: Date,
});

module.exports = mongoose.model("logs", RankingSchema);
