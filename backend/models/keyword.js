const mongoose = require("mongoose");

const keywordSchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  sites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Site" }],
});

module.exports = mongoose.model("Keyword", keywordSchema);
