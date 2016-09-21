var Promise = require('bluebird');
var rek = require('rekuire');
var R = require('ramda');

var hasher = rek('password-hasher');

var mongoose = require('mongoose');
var User = mongoose.model('User');

var createUserInDb = function(createPasswordResult, user) {
  // read in the data from our hashing operation
  user.password = createPasswordResult.hashedPassword;
  user.salt = createPasswordResult.salt;

  // create mongoose model
  var userModel = new User(user);

  // promise chain continues
  return userModel.save()
    .then(function(newUser) {
      return newUser;
    });
};

var create = function(user) {
  user.email = user.email.toLowerCase(); // the db can do case insensitive search but why incur the cost

  return hasher.createPassword(user.password)
    .then(createPasswordResult => createUserInDb(createPasswordResult, user));
};

var find = function(query) {
  return User.findOne(query);
};

var update = function(user) {
  // we don't ever update the password in this operation
  delete user.password;

  return User.findByIdAndUpdate(user.id, user);
};

var deleteDocument = function(query) {
  return User.remove(query);
};

var authenticateUser = function(email, password) {
  email = email.toLowerCase(); // the db can do case insensitive search but why incur the cost

  return User.findOne({ email: email })
          .then(userFromDb => {
            return hasher.comparePassword(password, userFromDb.salt, userFromDb.password)
          });
};

var updatePassword = function(user) {
  // in this operation we only update the password
  return hasher.hashPassword(user.salt, user.password)
                .then(hashedPasswordResult => User.findByIdAndUpdate(user.id, { $set: { password: hashedPasswordResult.hashedPassword }}));
};

module.exports = {
  create: create,
  find: find,
  update: update,
  delete: deleteDocument,
  authenticateUser: authenticateUser,
  updatePassword: updatePassword
};
