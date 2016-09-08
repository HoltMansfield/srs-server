var Promise = require('bluebird');
var config = require('config');
var mongoose = require('mongoose');

var connect = function(app) {
  return new Promise(function(resolve, reject) {
    // make the async call to 'connect'
    mongoose.connect(config.mongo.connection);
    
    dbConnection = mongoose.connection;

    // this is only called if we don't handle the error in the callback to an operation
    dbConnection.on('error', console.error.bind(console, 'unhandled DB error:'));

    // resolve the promise once connected to DB Server
    dbConnection.once('open', function callback() {
        resolve(app);
    });
  });
};

module.exports = {
  connect: connect
};
