// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true
  },
  // link is a required string
  link: {
    type: String,
    required: true
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;



// //note js
// // Require mongoose
// var mongoose = require("mongoose");

// // Create a Schema class with mongoose
// var Schema = mongoose.Schema;

// // Create a UserSchema with the Schema class
// var UserSchema = new Schema({
//   // name: a unique String
//   name: {
//     type: String,
//     unique: true
//   },
//   // notes property for the user
//   notes: [{
//     // Store ObjectIds in the array
//     type: Schema.Types.ObjectId,
//     // The ObjectIds will refer to the ids in the Note model
//     ref: "Note"
//   }]
// });

// // Create the User model with the UserSchema
// var User = mongoose.model("User", UserSchema);

// // Export the user model
// module.exports = User;
