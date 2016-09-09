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
    var options = { promiseLibrary: Promise };

    // make the async call to 'connect'
    var db = mongoose.createConnection(config.mongo.connection, options);

    // this is only called if we don't handle the error in the callback to an operation
    db.on('error', console.error.bind(console, 'unhandled DB error:'));

    // resolve the promise once connected to DB Server
    db.once('open', function callback() {
        resolve(app);
    });
  });
};

module.exports = {
  connect: connect
};
