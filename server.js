var express = require("express");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var app = express();
var db = require("./models");

// Express + Handlebars Configuration
// =======

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Mongo DB configuration
// =======

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/lesson-scraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

// Homepage route
// =======

app.get("/", (req, res) => {
  res.render("landing");
});

// w3Schools MongoDB Data Scrape Route
// =======

app.get("/w3scrape", (req, res) => {
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
        db.w3Schools.create(result).then(dbW3Schools => {
          console.log(dbW3Schools);
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

app.get("/w3", (req, res) => {
  db.w3Schools.find().then(dbW3Schools => {
    let hbsObject = { w3: dbW3Schools }
    res.render("w3schools", hbsObject);
  }).catch(err => {
    res.json(err);
  });
});

// Retrieve w3Schools lesson + its note by id
// =======

app.get("/w3/:id", (req, res) => {
  db.w3Schools.find(
    { _id: req.params.id }
  ).populate("note").then(dbW3Schools => {
    res.json(dbW3Schools);
  }).catch(err => {
    res.json(err);
  });
});

// Coursera MongoDB Data Scrape Route
// =======

app.get("/coursera-scrape", (req, res) => {
  axios.get("https://www.coursera.org/courses?query=programming&refinementList%5Blanguage%5D%5B0%5D=English&refinementList%5Btopic%5D%5B0%5D=Computer%20Science&refinementList%5Btopic%5D%5B1%5D=Data%20Science&refinementList%5Btopic%5D%5B2%5D=Information%20Technology&page=1&configure%5BclickAnalytics%5D=true&indices%5Btest_suggestions%5D%5Bconfigure%5D%5BclickAnalytics%5D=true&indices%5Btest_suggestions%5D%5Bconfigure%5D%5BhitsPerPage%5D=7&indices%5Btest_suggestions%5D%5BrefinementList%5D%5Bpage%5D=1&indices%5Btest_suggestions%5D%5Bpage%5D=1&indices%5Btest_careers%5D%5Bconfigure%5D%5BclickAnalytics%5D=true&indices%5Btest_careers%5D%5Bconfigure%5D%5BhitsPerPage%5D=1&indices%5Btest_careers%5D%5BrefinementList%5D%5Bpage%5D=1&indices%5Btest_careers%5D%5Bpage%5D=1&indices%5Btest_degrees_keyword_only%5D%5Bconfigure%5D%5BclickAnalytics%5D=true&indices%5Btest_degrees_keyword_only%5D%5Bconfigure%5D%5BhitsPerPage%5D=4&indices%5Btest_degrees_keyword_only%5D%5BrefinementList%5D%5Bpage%5D=1&indices%5Btest_degrees_keyword_only%5D%5Bpage%5D=1&indices%5Btest_products%5D%5Bconfigure%5D%5BclickAnalytics%5D=true&indices%5Btest_products%5D%5BrefinementList%5D%5Bpage%5D=1&indices%5Btest_products%5D%5Bpage%5D=1").then(response => {
    var $ = cheerio.load(response.data);
    $("div.card-info").each((i, element) => {
      var title = $(element).children("h2").text();
      var description = $(element).children("span").text();
      var link = $(element).parents("a").attr("href");
      var result = {
        title,
        description,
        link: `https://coursera.org${link}`
      };
      db.Coursera.create(result).then(dbCoursera => {
        console.log(dbCoursera);
      }).catch(err => {
        console.log(err);
      });
    });
    res.send("Scrape Complete");
  });
});

// Coursera MongoDB Data Retrieval Route
// =======

app.get("/coursera", (req, res) => {
  db.Coursera.find().then(dbCoursera => {
    let hbsObject = { coursera: dbCoursera }
    res.render("coursera", hbsObject);
  }).catch(err => {
    res.json(err);
  });
});

// Retrieve Coursera lesson + its note by id
// =======

app.get("/coursera/:id", (req, res) => {
  db.Coursera.find(
    { _id: req.params.id }
  ).populate("note").then(dbCoursera => {
    res.json(dbCoursera);
  }).catch(err => {
    res.json(err);
  });
});

// Medium/Programming MongoDB Data Scrape Route
// =======

app.get("/medium-scrape", (req, res) => {
  axios.get("https://medium.com/topic/programming").then(function(response) {
    var $ = cheerio.load(response.data);
    $(".dv.dw").each(function(i, element) {
      var title = $(element).children("h3").text();
      var link = $(element).children("h3").children("a").attr("href");
      var blurb = $(element).children(".eb.c").children("p").children("a").text();
      var result = {
        title,
        link: `https://medium.com${link}`,
        blurb
      };
      db.Medium.create(result).then(dbMedium => {
        console.log(dbMedium);
      }).catch(err => {
        console.log(err);
      });
    });
    res.send("Scrape Complete");
  });
});

// Medium/Programming MongoDB Data Retrieval Route
// =======

app.get("/medium", (req, res) => {
  db.Medium.find().then(dbMedium => {
    let hbsObject = { medium: dbMedium }
    res.render("medium", hbsObject);
  }).catch(err => {
    res.json(err);
  });
});

// Retrieve Medium/Programming post + its note by id
// =======

app.get("/medium/:id", (req, res) => {
  db.Medium.find(
    { _id: req.params.id }
  ).populate("note").then(dbMedium => {
    res.json(dbMedium);
  }).catch(err => {
    res.json(err);
  });
});

// CodeCademy MongoDB Data Scrape Route
// =======

app.get("/code-cademy-scrape", (req, res) => {
  axios.get("https://www.codecademy.com/catalog/subject/all").then(function(response) {
    var $ = cheerio.load(response.data);
    $(".standardPadding__2Qfs_mGV0Kt7Y3sHTOhHtm").each(function(i, element) {
      var title = $(element).children("h3").text();
      var description = $(element).children(".description__HE5KMDlhAdQy_Ka7F01wq, .description__npYO7MgT0O4SxUnbGreZu").text();
      var link = $(element).parents("a").attr("href");
      var result = {
        title,
        description,
        link: `https://www.codecademy.com${link}`
      };
      db.CodeCademy.create(result).then(dbCodeCademy => {
        console.log(dbCodeCademy);
      }).catch(err => {
        console.log(err);
      });
    });
    res.send("Scrape Complete");
  });
});

// CodeCademy MongoDB Data Retrieval Route
// =======

app.get("/code-cademy", (req, res) => {
  db.CodeCademy.find().then(dbCodeCademy => {
    let hbsObject = { codeCademy: dbCodeCademy }
    res.render("code-cademy", hbsObject);
  }).catch(err => {
    res.json(err);
  });
});

// Retrieve CodeCademy post + its note by id
// =======

app.get("/code-cademy/:id", (req, res) => {
  db.CodeCademy.find(
    { _id: req.params.id }
  ).populate("note").then(dbCodeCademy => {
    res.json(dbCodeCademy);
  }).catch(err => {
    res.json(err);
  });
});

// "71 Free Code Learning Resources" MongoDB Data Scrape Route
// =======

app.get("/learn-scrape", (req, res) => {
  axios.get("https://learntocodewith.me/posts/code-for-free/").then(function(response) {
    var $ = cheerio.load(response.data);
    $("p").each(function(i, element) {
      var title = $(element).children().children("a").text();
      var description = $(element).next("p").text();
      var link = $(element).children().children("a").attr("href");
      if (title.length > 0 && title !== "Head back to the table of contents »") {
        var result = {
          title,
          description,
          link
        };
        db.Learn.create(result).then(dbLearn => {
          console.log(dbLearn);
        }).catch(err => {
          console.log(err);
        });
      }
    });
    res.send("Scrape Complete");
  });
});

// "71 Free Code Learning Resources" MongoDB Data Retrieval Route
// =======

app.get("/learn", (req, res) => {
  db.Learn.find().then(dbLearn => {
    let hbsObject = { learn: dbLearn }
    res.render("learn", hbsObject);
  }).catch(err => {
    res.json(err);
  });
});

// Retrieve CodeCademy post + its note by id
// =======

app.get("/learn/:id", (req, res) => {
  db.Learn.find(
    { _id: req.params.id }
  ).populate("note").then(dbLearn => {
    res.json(dbLearn);
  }).catch(err => {
    res.json(err);
  });
});

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(3000, () => {
  console.log("App running on port 3000!");
});