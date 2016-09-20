var Promise = require('bluebird');
var rek = require('rekuire');
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

var createUser = function(user) {
  user.email = user.email.toLowerCase(); // the db can do case insensitive search but why incur the cost

  return hasher.createPassword(user.password)
    .then(createPasswordResult => createUserInDb(createPasswordResult, user));
};

var authenticateUser = function(email, password) {
  email = email.toLowerCase(); // the db can do case insensitive search but why incur the cost

  return User.findOne({ email: email })
          .then(userFromDb => {
            return hasher.comparePassword(password, userFromDb.salt, userFromDb.password)
          });
};

var findUser = function(query) {
  return User.findOne(query);
};

module.exports = {
  createUser: createUser,
  authenticateUser: authenticateUser,
  findUser: findUser  
};
