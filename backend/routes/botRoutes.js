const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Keyword =
  mongoose.models.Keyword ||
  mongoose.model("Keyword", new mongoose.Schema({
    keyword: String,
    daily_limit: { type: Number, default: 4 },
    daily_count: { type: Map, of: Number },
    sites: [mongoose.Schema.Types.ObjectId],
  }));

const Site =
  mongoose.models.Site ||
  mongoose.model("Site", new mongoose.Schema({
    domain: String,
  }));

router.get("/keywords", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const keywords = await Keyword.find();

    const response = await Promise.all(
      keywords.map(async (keywordDoc) => {
        const dailyCount = keywordDoc.daily_count.get(today) || 0;
        if (dailyCount < keywordDoc.daily_limit) {
          const sites = await Site.find({ _id: { $in: keywordDoc.sites } });

          return {
            _id: keywordDoc._id,
            keyword: keywordDoc.keyword,
            sites: sites.map((site) => site.domain),
          };
        }
        return null;
      })
    );

    res.json(response.filter((item) => item !== null));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/keywords/:id/update-count", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const keywordId = req.params.id;

    const keyword = await Keyword.findById(keywordId);
    if (!keyword) return res.status(404).json({ error: "Keyword not found" });

    const dailyCount = keyword.daily_count.get(today) || 0;
    keyword.daily_count.set(today, dailyCount + 1);

    await keyword.save();
    res.json({ message: "Daily count updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
