/* all the models in the collections folder get processed for registration by collection-manager.js */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var isRegistered = mongoose.models.Tweet; // if the User model exists our flag initalizes true and the whole process is skipped
var schemaDefinition;


var register = function() {
  // check if our schema has already been registered
  if(!isRegistered) {

    // define schema
    schemaDefinition = new Schema({
        tweetBody: { type: String, required: true, unique: true },

        // the users that tweeted this
        postedBy: { type: Schema.ObjectId, ref: 'users', required: true },
    });

    // register the schema with mongoose to 'create' a model
    mongoose.model('Tweet', schemaDefinition);

    isRegistered = true; // run this once
  }

  return schemaDefinition;
};

module.exports.register = register;
