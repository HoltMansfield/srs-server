var mongoose     = require('mongoose');
var mongooseSchema       = mongoose.Schema;

var schema  =  {
    dateCreated: { type: Date, default: Date.now },
    email: { type: String, required: true, unique: true },
    salt: { type: String },
    password: { type: String },

    first: { type: String },
    last: { type: String },
    avatar: { type: String },
}

module.exports = schema;
