var Promise = require('bluebird');
var rek = require('rekuire');
var config = require('config');
var mongoose = require('mongoose');

var collections = rek('collection-manager');

var connect = function(app) {
  return new Promise(function(resolve, reject) {
    // make a synchronous call to import mongo models
    collections.importCollections();

    // Use bluebird
    mongoose.Promise = Promise;

    // make the async call to 'connect'
    var connection = mongoose.connect(config.mongo.connection).connection;

    // this is only called if we don't handle the error in the callback to an operation
    connection.on('error', console.error.bind(console, 'unhandled DB error:'));

    // resolve the promise once connected to DB Server
    connection.once('open', function callback() {
        resolve(app);
    });
  });
};

module.exports = {
  connect: connect
};
