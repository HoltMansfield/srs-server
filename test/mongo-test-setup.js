var Promise = require('bluebird');

var clearDb = function(mongoose, done) {
  function clearDB() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove();
    }
    return done();
  }

  function reconnect() {
    mongoose.connect('mongodb://localhost:27017/testC8', function (err) {
    //mongoose.connect('mongodb://holt:nhy78UJM@ds041651.mongolab.com:41651/c8_technology_com', function (err) {
      if (err) {
        throw err;
      }
      return clearDB();
    });
  }

  function checkState() {
    switch (mongoose.connection.readyState) {
    case 0:
      reconnect();
      break;
    case 1:
      clearDB();
      break;
    default:
      process.nextTick(checkState);
    }
  }

  checkState();
};

var disconnect = function(mongoose, done) {
  mongoose.disconnect();
  return done();
};

var prepareNodeEnvironment = function() {
  process.env.NODE_ENV = 'test';
  process.env.nodeAppPath = process.env.PWD + '/server';

  return process.env.nodeAppPath;
};

module.exports.clearDb = clearDb;
module.exports.disconnect = disconnect;
module.exports.prepareNodeEnvironment = prepareNodeEnvironment;
