const Promise = require('bluebird');
const rek = require('rekuire');
const config = require('config');
const mongoose = require('mongoose');

const collections = rek('collection-manager');

const initialize = function(app, resolve, reject) {
  // make a synchronous call to import mongo models
  collections.importCollections();

  // use bluebird for Promises
  mongoose.Promise = Promise;

  // make the async call to 'connect'
  const connection = mongoose.connect(config.mongo.connection).connection;

  if(!connection._events) {
    // error handler is not already setup (this is only relevant in test scenarios)

    // this is only called if we don't handle the error in the callback to an operation
    connection.on('error', console.error.bind(console, 'unhandled DB error:'));
  }

  // resolve the promise once connected to DB Server
  connection.once('open', function callback() {
      resolve(app);
  });
};

const connect = function(app) {
  return new Promise(function(resolve, reject) {
    if(mongoose.connection.readyState) {
      // we are already connected
      resolve(app);
    } else {
      initialize(app, resolve, reject);
    }
  });
};

const disconnect = function() {
  return new Promise((resolve, reject) => {
    mongoose.disconnect(() => {
      resolve(true);
    });
  });
};

module.exports = {
  connect: connect,
  disconnect: disconnect
};
