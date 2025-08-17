const express = require("express");
const router = express.Router();
const Ranking = require("../models/ranking");

router.get("/", async (req, res) => {
  try {
    const lineChartData = await Ranking.aggregate([
      {
        $group: {
          _id: { site: "$site", keyword: "$keyword" },
          min: { $min: "$rank" },
          max: { $max: "$rank" },
          avg: { $avg: "$rank" },
          rankings: { $push: "$rank" },
          timestamps: { $push: "$timestamp" },
        },
      },
      {
        $project: {
          _id: 0,
          site: "$_id.site",
          keyword: "$_id.keyword",
          min: 1,
          max: 1,
          avg: 1,
          rankings: 1,
          timestamps: 1,
        },
      },
    ]);

    const barChartData = await Ranking.aggregate([
      {
        $group: {
          _id: "$keyword",
          count: { $sum: 1 },
        },
      },
    ]);

    const tableData = await Ranking.aggregate([
      {
        $group: {
          _id: { keyword: "$keyword", site: "$site" },
          min: { $min: "$rank" },
          max: { $max: "$rank" },
          avg: { $avg: "$rank" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          keyword: "$_id.keyword",
          site: "$_id.site",
          min: 1,
          max: 1,
          avg: 1,
          count: 1,
        },
      },
    ]);

    res.json({
      lineChartData,
      barChartData,
      tableData,
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;
