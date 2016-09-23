/* all the models in the collections folder get processed for registration by collection-manager.js */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var isRegistered = mongoose.models.User; // if the User model exists our flag initalizes true and the whole process is skipped


var register = function() {
  if(!isRegistered) {
    // define schema
    var schema  = new Schema({
        dateCreated: { type: Date, default: Date.now },
        email: { type: String, required: true, unique: true },
        salt: { type: String },
        password: { type: String },

        first: { type: String },
        last: { type: String },
        avatar: { type: String },
    });

    // register the schema with mongoose to 'create' a model
    mongoose.model('User', schema);

    isRegistered = true; // run this once
  }
};

module.exports.register = register;
