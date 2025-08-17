const Keyword = require("../models/keyword");
const Site = require("../models/site");
const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");

const pythonScript = "./bot.py";
const args = [];

router.post("/", async (req, res) => {
  const { keyword, siteIds, excelData } = req.body;

  if (!keyword && (!excelData || excelData.length === 0)) {
    return res
      .status(400)
      .json({ error: "لطفاً کلمه کلیدی یا داده‌های اکسل را ارسال کنید." });
  }

  try {
    if (keyword && siteIds && siteIds.length > 0) {
      const newKeyword = new Keyword({
        keyword,
        sites: siteIds,
      });
      await newKeyword.save();
    }

    if (excelData && excelData.length > 0) {
      for (const entry of excelData) {
        const { keyword: excelKeyword, sites } = entry;

        if (!excelKeyword || !sites) {
          console.error("ورودی اکسل ناقص است:", entry);
          continue;
        }

        const siteNames = sites.split(",").map((site) => site.trim());
        const siteIdsFromExcel = [];

        for (const name of siteNames) {
          const site = await Site.findOne({ domain: name });

          if (site) {
            siteIdsFromExcel.push(site._id);
          } else {
            console.error(`سایت "${name}" یافت نشد.`);
          }
        }

        if (siteIdsFromExcel.length > 0) {
          const newKeyword = new Keyword({
            keyword: excelKeyword,
            sites: siteIdsFromExcel,
          });
          await newKeyword.save();
        }
      }
    }

    const pythonProcess = spawn("python", [pythonScript, ...args]);

    pythonProcess.stdout.on("data", (data) => {
      console.log(`Output: ${data}`);
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python script finished with code ${code}`);
    });

    res.status(200).json({ message: "کلمات کلیدی با موفقیت ذخیره شدند." });
  } catch (err) {
    console.error("خطا در ذخیره‌سازی کلمات کلیدی:", err);
    res.status(500).json({ error: "خطا در ذخیره‌سازی کلمات کلیدی" });
  }
});

router.get("/", async (req, res) => {
  try {
    const keywords = await Keyword.find().populate("sites", "name domain");
    res.status(200).json(keywords);
  } catch (err) {
    console.error("خطا در دریافت کلمات کلیدی:", err);
    res.status(500).json({ error: "خطا در دریافت کلمات کلیدی" });
  }
});

module.exports = router;
