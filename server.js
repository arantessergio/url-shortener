const express = require("express");
const mongoose = require("mongoose");

const ShortUrl = require("./models/shortUrl");
const dbConfig = require("./config/database");

const app = express();

mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });

  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shrinked = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shrinked == null) return res.sendStatus(404);

  shrinked.clicks++;
  shrinked.save();

  res.redirect(shrinked.full);
});

app.listen(process.env.SERVER_PORT || 3000);
