var Promise = require('bluebird');
var rek = require('rekuire');
var mongoManager = rek('mongo-manager');

var clearDb = function(mongoose, done) {
  function clearDB() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove();
    }
    return done();
  }

  function reconnect() {
    // mongo manager connects to DB & reads in all models
    mongoManager.connect()
     .then(function() {
      return clearDB();
    })
    .catch(function() {
      throw err;
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

// var prepareNodeEnvironment = function() {
//   process.env.NODE_ENV = 'test';
//   process.env.nodeAppPath = process.env.PWD + '/server';
//
//   return process.env.nodeAppPath;
// };

module.exports.clearDb = clearDb;
module.exports.disconnect = disconnect;
//module.exports.prepareNodeEnvironment = prepareNodeEnvironment;
