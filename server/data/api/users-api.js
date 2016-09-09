var Promise = require('bluebird');
var rek = require('rekuire');

var collections = rek('collection-manager').models;

var createUser = function(user) {
  //return new Promise(function(resolve, reject) {
    var userModel = new collections.users(user);

    return userModel.saveAsync()
      // We need to use `spread` because `model.save` yields an array
      .spread(function(newUser) {
        return newUser;
      });
  //});
};

module.exports.createUser = createUser;
