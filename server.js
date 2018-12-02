var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var app = express();
var db = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/lesson-scraper";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

// Main route
// =======

app.get("/", (req, res) => {
  res.send("Hello world");
});

// w3Schools MongoDB Data Scrape Route
// =======

app.get("/scrape", (req, res) => {
  axios.get("https://www.w3schools.com/").then(response => {
    var $ = cheerio.load(response.data);
    $("a.w3-bar-item.w3-button").each((i, element) => {
      var section = $(element).siblings("h3").text();
      var title = $(element).text();
      var link = $(element).attr("href");
      if (title.length > 1 && section.length != 0) {
        var result = {
          section,
          title,
          link: `http://w3schools.com${link}`
        };
        db.w3Schools.create(result).then(dbArticle => {
          console.log(dbArticle);
        }).catch(err => {
          console.log(err);
        });
      }
    });
    res.send("Scrape Complete");
  });
});

// w3Schools MongoDB Data Retrieval Route
// =======

app.get("/w3lessons", (req, res) => {
  db.w3Schools.find().then(dbW3Schools => {
    res.json(dbW3Schools);
  }).catch(err => {
    res.json(err);
  });
});

// Retrieve w3Schools lesson + its note by id
// =======

app.get("/w3lessons/:id", (req, res) => {
  db.w3Schools.find(
    { _id: req.params.id }
  ).populate("note").then(dbW3Schools => {
    res.json(dbW3Schools);
  }).catch(err => {
    res.json(err);
  });
});

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(3000, () => {
  console.log("App running on port 3000!");
});