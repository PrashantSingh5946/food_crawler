const express = require("express");
const fetchStructuredData = require("./lib/fetchStructuredData");
const bodyParser = require("body-parser");
const Recipe = require("./models/recipe");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const crawler = require("./lib/crawler");

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Import one recipe from a URL
app.post("/recipe/import", async (req, res) => {
  try {
    const creator_id = "demo@samplemail.com";
    const { url } = req.body;

    if (url) {
      let data = await fetchStructuredData(url);

      console.log(data);

      data = data[0];
      data["creator_id"] = creator_id;

      await new Recipe(data).save();

      res.send("Recipe created");
    } else {
      res.send("Invalid input. URL is missing");
    }
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

// Import multiple recipes from a URL by crawling the whole website, up to a maximum of insertionLimit
app.post("/recipe/bulk_import", async (req, res) => {
  if (!req.body.url) {
    res.send("Invalid input. URLs are missing", 500);
  }

  try {
    let totalRecordsInserted = await crawler(req.body.url, 100);
    res.send(
      "Crawling completed with " + totalRecordsInserted + " records inserted"
    );
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

//Fetch all the recipes
app.get("/recipe/all", async (req, res) => {
  //Remove object ids from the recipes

  let recipes = await Recipe.find();

  res.send(recipes);
});

app.listen(8000, async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Server running");
});
