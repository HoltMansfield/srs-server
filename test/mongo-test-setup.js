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

function checkState(resolve, reject, mongoose) {
  switch (mongoose.connection.readyState) {
  case 0:
    connect(resolve, reject, mongoose);
    break;
  case 1:
    clearDB(resolve, reject, mongoose);
    break;
  default:
    process.nextTick(function() {
      checkState(resolve, reject, mongoose);
    });
  }
}

var clearDb = function(mongoose) {
  return new Promise(function(resolve, reject) {
      checkState(resolve, reject, mongoose);
  });
};

var disconnect = function(mongoose, done) {
  mongoManager.disconnect()
    .then(() => done());
};

module.exports = {
  clearDb: clearDb,
  disconnect: disconnect
};
