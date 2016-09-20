var Promise = require('bluebird');
var rek = require('rekuire');
var mongoManager = rek('mongo-manager');

function clearDB(resolve, reject, mongoose) {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove();
  }

  resolve(true);
}

function connect(resolve, reject, mongoose) {
  // mongo manager connects to DB & reads in all models
  mongoManager.connect()
   .then(function() {
    clearDB(resolve, reject, mongoose);
  });
}

var clearDb = function(mongoose) {
  return new Promise(function(resolve, reject) {
    if(!mongoose.connection.readyState) {
      connect(resolve, reject, mongoose);
    } else {
      clearDB(resolve, reject, mongoose);
    }
  });
};

var disconnect = function(mongoose) {
  mongoose.disconnect();

  return done();
};

module.exports = {
  clearDb: clearDb,
  disconnect: disconnect
};
