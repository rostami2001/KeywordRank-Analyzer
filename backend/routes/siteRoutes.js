const express = require("express");
const Site = require("../models/site");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const site = new Site(req.body);
    await site.save();
    res.status(201).json(site);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  const sites = await Site.find();
  res.json(sites);
});

router.put("/:id", async (req, res) => {
  try {
    const site = await Site.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(site);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  await Site.findByIdAndDelete(req.params.id);
  res.json({ message: "Site deleted" });
});

module.exports = router;
