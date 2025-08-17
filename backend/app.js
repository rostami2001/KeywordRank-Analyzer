const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const siteRoutes = require("./routes/siteRoutes");
const keywordRoutes = require("./routes/keywordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
// const botRoutes = require("./routes/botRoutes");
// const logRoutes = require("./routes/logRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// مسیرها
app.use("/sites", siteRoutes);
app.use("/keywords", keywordRoutes);
app.use("/dashboard", dashboardRoutes);
// app.use("/bot", botRoutes);
// app.use("/logs", logRoutes);

mongoose
  .connect("mongodb://localhost:27017/keywords_db")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3004, () =>
      console.log("Server started on http://localhost:3004")
    );
  })
  .catch((err) => console.error(err));
