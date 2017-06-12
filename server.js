/* 
  * ====================
  * NEWS SCRAPER 
  * Back-End 
  * ==================== 
*/

// ============
// Dependencies
// ============
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var mongojs = require("mongojs");


// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

// Scraping Tools
// Snatches HTML from URLS
var request = require("request");
// Scrapes desired HTML
var cheerio = require("cheerio");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// configure app for body parser (post routes/pulling data out of forms) with our app
app.use(bodyParser.urlencoded({
  extended: false
}));

// Static file support with public folder
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://heroku_pfrjtt36:rc6fj9k8ucucv7q4h11rlipffm@ds157631.mlab.com:57631/heroku_pfrjtt36");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful ✔︎");
});



// ======
// Routes
// ======

// A GET request to scrape the echojs website
app.get("/scrape", function(req, res) {


  // First, tell the console what server.js is doing
  console.log("\n*********************************\n"+ "Below is every article headline and link\n" +
    "from the Slashdot website:" +
    "\n*********************************\n");

  // First, we grab the body of the html with request
  request("https://slashdot.org/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("span.story-title").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
  });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");
});

// This will get the articles we scraped from the mongoDB: outputs JSON object
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});


// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});


// New note creation via POST route
app.post("/submit", function(req, res) {
  // Use our Note model to make a new note from the req.body
  var newNote = new Note(req.body);
  // Save the new note to mongoose
  newNote.save(function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Otherwise
    else {
      // Find our user and push the new note id into the User's notes array
      User.findOneAndUpdate({}, { $push: { "notes": doc._id } }, { new: true }, function(err, newdoc) {
        // Send any errors to the browser
        if (err) {
          res.send(err);
        }
        // Or send the newdoc to the browser
        else {
          res.send(newdoc);
        }
      });
    }
  });
});



// // Route to see what user looks like WITH populating
// app.get("/populateduser", function(req, res) {
//   // Prepare a query to find all users..
//   User.find({})
//     // ..and on top of that, populate the notes (replace the objectIds in the notes array with bona-fide notes)
//     .populate("notes")
//     // Now, execute the query
//     .exec(function(error, doc) {
//       // Send any errors to the browser
//       if (error) {
//         res.send(error);
//       }
//       // Or send the doc to the browser
//       else {
//         res.send(doc);
//       }
//     });
// });




// Listen on port 3000
app.listen(3000, function() {
  console.log("Application running on port 3000 ✔︎");
});

var port_number = server.listen(process.env.PORT || 3000);
app.listen(port_number);