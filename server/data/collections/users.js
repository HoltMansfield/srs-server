/* all the models in the collections folder get processed for registration by collection-manager.js */

var mongoose = require('mongoose');
var rek = require('rekuire');
var Schema = mongoose.Schema;
var isRegistered = mongoose.models.User; // if the model exists our flag initalizes true and the whole process is skipped
var schemaDefinition;

// associated doc
var tweetSchema = rek('tweet').register();

var register = function() {
  // check if our schema has already been registered
  if(!isRegistered) {

    // define schema
    schemaDefinition  = new Schema({
        dateCreated: { type: Date, default: Date.now },
        email: { type: String, required: true, unique: true },
        salt: { type: String },
        password: { type: String },

        first: { type: String },
        last: { type: String },
        avatar: { type: String },

        // the users this user is following
        following: { type: [Schema.ObjectId], ref: 'users' },
    });

    // register the schema with mongoose to 'create' a model
    mongoose.model('User', schemaDefinition);

    isRegistered = true; // run this once
  }

  return schemaDefinition;
};

module.exports.register = register;
