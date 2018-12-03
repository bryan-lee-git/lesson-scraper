// App Dependencies
// =======

const express = require("express");
const exphbs = require("express-handlebars");
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const app = express();
const db = require("./models");
const PORT = process.env.PORT || 3000;

// Express + Handlebars Configuration
// =======

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Mongo DB configuration
// =======

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/lesson-scraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

// Homepage route
// =======

app.get("/", (req, res) => { res.render("landing") });

// w3Schools MongoDB Data Scrape Route
// =======

app.get("/w3-scrape", (req, res) => {
  axios.get("https://www.w3schools.com/").then(response => {
    let $ = cheerio.load(response.data);
    $("a.w3-bar-item.w3-button").each((i, element) => {
      let section = $(element).siblings("h3").text();
      let title = $(element).text();
      let link = $(element).attr("href");
      if (title.length > 1 && section.length != 0) {
        let result = {
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
    let hbsObject = {
      w3: dbW3Schools
    }
    res.render("w3schools", hbsObject);
  }).catch(err => {
    res.json(err);
  });
});

// Retrieve w3Schools lesson + its note by id
// =======

app.get("/w3/:id", (req, res) => {
  db.w3Schools.find({
    _id: req.params.id
  }).populate("note").then(dbW3Schools => {
    res.json(dbW3Schools);
  }).catch(err => {
    res.json(err);
  });
});


// Route for saving/updating an W3Schools's associated Note
// =======

app.post("/w3/:id", (req, res) => {
  db.Note.create(req.body).then(dbNote => {
      return db.w3Schools.findOneAndUpdate({
        _id: req.params.id
      }, {
        note: dbNote._id
      }, {
        new: true
      });
    }).then(dbW3Schools => {
      res.json(dbW3Schools);
    }).catch(err => {
      res.json(err);
    });
});


// Coursera MongoDB Data Scrape Route
// =======

app.get("/coursera-scrape", (req, res) => {
  axios.get("https://www.coursera.org/courses?query=programming&refinementList%5Blanguage%5D%5B0%5D=English&refinementList%5Btopic%5D%5B0%5D=Computer%20Science&refinementList%5Btopic%5D%5B1%5D=Data%20Science&refinementList%5Btopic%5D%5B2%5D=Information%20Technology&page=1&configure%5BclickAnalytics%5D=true&indices%5Btest_suggestions%5D%5Bconfigure%5D%5BclickAnalytics%5D=true&indices%5Btest_suggestions%5D%5Bconfigure%5D%5BhitsPerPage%5D=7&indices%5Btest_suggestions%5D%5BrefinementList%5D%5Bpage%5D=1&indices%5Btest_suggestions%5D%5Bpage%5D=1&indices%5Btest_careers%5D%5Bconfigure%5D%5BclickAnalytics%5D=true&indices%5Btest_careers%5D%5Bconfigure%5D%5BhitsPerPage%5D=1&indices%5Btest_careers%5D%5BrefinementList%5D%5Bpage%5D=1&indices%5Btest_careers%5D%5Bpage%5D=1&indices%5Btest_degrees_keyword_only%5D%5Bconfigure%5D%5BclickAnalytics%5D=true&indices%5Btest_degrees_keyword_only%5D%5Bconfigure%5D%5BhitsPerPage%5D=4&indices%5Btest_degrees_keyword_only%5D%5BrefinementList%5D%5Bpage%5D=1&indices%5Btest_degrees_keyword_only%5D%5Bpage%5D=1&indices%5Btest_products%5D%5Bconfigure%5D%5BclickAnalytics%5D=true&indices%5Btest_products%5D%5BrefinementList%5D%5Bpage%5D=1&indices%5Btest_products%5D%5Bpage%5D=1").then(response => {
    let $ = cheerio.load(response.data);
    $("div.card-info").each((i, element) => {
      let title = $(element).children("h2").text();
      let description = $(element).children("span").text();
      let link = $(element).parents("a").attr("href");
      let result = {
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
    let hbsObject = {
      coursera: dbCoursera
    }
    res.render("coursera", hbsObject);
  }).catch(err => {
    res.json(err);
  });
});

// Retrieve Coursera lesson + its note by id
// =======

app.get("/coursera/:id", (req, res) => {
  db.Coursera.find({
    _id: req.params.id
  }).populate("note").then(dbCoursera => {
    res.json(dbCoursera);
  }).catch(err => {
    res.json(err);
  });
});

// Route for saving/updating an Coursera's associated Note
// =======

app.post("/coursera/:id", (req, res) => {
  db.Note.create(req.body).then(dbNote => {
      return db.Coursera.findOneAndUpdate({
        _id: req.params.id
      }, {
        note: dbNote._id
      }, {
        new: true
      });
    }).then(dbCoursera => {
      res.json(dbCoursera);
    }).catch(err => {
      res.json(err);
    });
});


// Medium/Programming MongoDB Data Scrape Route
// =======

app.get("/medium-scrape", (req, res) => {
  axios.get("https://medium.com/topic/programming").then(response => {
    let $ = cheerio.load(response.data);
    $(".dv.dw").each((i, element) => {
      let title = $(element).children("h3").text();
      let link = $(element).children("h3").children("a").attr("href");
      let blurb = $(element).children(".eb.c").children("p").children("a").text();
      let result = {
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
    let hbsObject = {
      medium: dbMedium
    }
    res.render("medium", hbsObject);
  }).catch(err => {
    res.json(err);
  });
});

// Retrieve Medium/Programming post + its note by id
// =======

app.get("/medium/:id", (req, res) => {
  db.Medium.find({
    _id: req.params.id
  }).populate("note").then(dbMedium => {
    res.json(dbMedium);
  }).catch(err => {
    res.json(err);
  });
});

// Route for saving/updating an Medium's associated Note
// =======

app.post("/medium/:id", (req, res) => {
  db.Note.create(req.body).then(dbNote => {
      return db.Medium.findOneAndUpdate({
        _id: req.params.id
      }, {
        note: dbNote._id
      }, {
        new: true
      });
    }).then(dbMedium => {
      res.json(dbMedium);
    }).catch(err => {
      res.json(err);
    });
});


// CodeCademy MongoDB Data Scrape Route
// =======

app.get("/code-cademy-scrape", (req, res) => {
  axios.get("https://www.codecademy.com/catalog/subject/all").then(response => {
    let $ = cheerio.load(response.data);
    $(".standardPadding__2Qfs_mGV0Kt7Y3sHTOhHtm").each((i, element) => {
      let title = $(element).children("h3").text();
      let description = $(element).children(".description__HE5KMDlhAdQy_Ka7F01wq, .description__npYO7MgT0O4SxUnbGreZu").text();
      let link = $(element).parents("a").attr("href");
      let result = {
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
    let hbsObject = {
      codeCademy: dbCodeCademy
    }
    res.render("code-cademy", hbsObject);
  }).catch(err => {
    res.json(err);
  });
});

// Retrieve CodeCademy post + its note by id
// =======

app.get("/code-cademy/:id", (req, res) => {
  db.CodeCademy.find({
    _id: req.params.id
  }).populate("note").then(dbCodeCademy => {
    res.json(dbCodeCademy);
  }).catch(err => {
    res.json(err);
  });
});

// Route for saving/updating an CodeCademy's associated Note
// =======

app.post("/code-cademy/:id", (req, res) => {
  db.Note.create(req.body).then(dbNote => {
      return db.CodeCademy.findOneAndUpdate({
        _id: req.params.id
      }, {
        note: dbNote._id
      }, {
        new: true
      });
    }).then(dbCodeCademy => {
      res.json(dbCodeCademy);
    }).catch(err => {
      res.json(err);
    });
});


// "71 Free Code Learning Resources" MongoDB Data Scrape Route
// =======

app.get("/learn-scrape", (req, res) => {
  axios.get("https://learntocodewith.me/posts/code-for-free/").then(response => {
    let $ = cheerio.load(response.data);
    $("p").each((i, element) => {
      let title = $(element).children().children("a").text();
      let description = $(element).next("p").text();
      let link = $(element).children().children("a").attr("href");
      if (title.length > 0 && title !== "Head back to the table of contents »") {
        let result = {
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
    let hbsObject = {
      learn: dbLearn
    }
    res.render("learn", hbsObject);
  }).catch(err => {
    res.json(err);
  });
});

// Retrieve "71 Free Code Learning Resources" post + its note by id
// =======

app.get("/learn/:id", (req, res) => {
  db.Learn.find({
    _id: req.params.id
  }).populate("note").then(dbLearn => {
    res.json(dbLearn);
  }).catch(err => {
    res.json(err);
  });
});

// Route for saving/updating an Learn's associated Note
// =======

app.post("/learn/:id", (req, res) => {
  db.Note.create(req.body).then(dbNote => {
      return db.Learn.findOneAndUpdate({
        _id: req.params.id
      }, {
        note: dbNote._id
      }, {
        new: true
      });
    }).then(dbLearn => {
      res.json(dbLearn);
    }).catch(err => {
      res.json(err);
    });
});


// Code Videos MongoDB Data Scrape Route
// =======

app.get("/code-videos-scrape", (req, res) => {
  axios.get("https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=learn+coding&type=video&videoEmbeddable=true&key=AIzaSyDEN3-Xo9I-Ycjy-cTlOygMnHB3p5ZhVg4").then(response => {
    for (let i = 0; i < response.data.items.length; i++) {
      let result = {
        title: response.data.items[i].snippet.title,
        channel: response.data.items[i].snippet.channelTitle,
        description: response.data.items[i].snippet.description,
        videoId: response.data.items[i].id.videoId,
        link: `https://www.youtube.com/watch?v=${response.data.items[i].id.videoId}`
      };
      db.CodeVideos.create(result).then(dbCodeVideos => {
        console.log(dbCodeVideos);
      }).catch(err => {
        console.log(err);
      });
    }
    res.send("Scrape Complete");
  });
});

// Code Videos MongoDB Data Retrieval Route
// =======

app.get("/code-videos", (req, res) => {
  db.CodeVideos.find().then(dbCodeVideos => {
    let hbsObject = {
      codeVideos: dbCodeVideos
    }
    res.render("code-videos", hbsObject);
  }).catch(err => {
    res.json(err);
  });
});

// Retrieve Code Video + its note by id
// =======

app.get("/code-videos/:id", (req, res) => {
  db.CodeVideos.find({
    _id: req.params.id
  }).populate("note").then(dbCodeVideos => {
    res.json(dbCodeVideos);
  }).catch(err => {
    res.json(err);
  });
});

// Route for saving/updating an CodeVideos's associated Note
// =======

app.post("/code-videos/:id", (req, res) => {
  db.Note.create(req.body).then(dbNote => {
      return db.CodeVideos.findOneAndUpdate({
        _id: req.params.id
      }, {
        note: dbNote._id
      }, {
        new: true
      });
    }).then(dbCodeVideos => {
      res.json(dbCodeVideos);
    }).catch(err => {
      res.json(err);
    });
});

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});