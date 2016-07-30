var bcrypt = require('bcrypt-as-promised');
var Promise = require('bluebird');

var requireArguments = function(arguments) {
  arguments.forEach(function(argument) {
    // programming by contract
    if(!argument.value) throw Error('password-hasher.hash() requires ' +argument.name);
  });
};

// calling code needs to store salt and hashedPassword in the DB
var packageCreatePasswordResponse = function(salt, hashedPassword) {
  var createPasswordResult = {
    salt: salt,
    hashedPassword: hashedPassword
  }

  return createPasswordResult;
};

var createPassword = function(password) {
  requireArguments([{ name: 'password', value: password }]);

  // create a salt
  return bcrypt.genSalt()
          .then(function(salt) {
            // use that salt to hash the password
            return bcrypt.hash(password, salt)
             .then(function(hashedPassword) {
               // return salt and hashedPassword
               return packageCreatePasswordResponse(salt, hashedPassword);
             });
          });
};

var comparePassword = function(password, salt, hashedPasswordFromDb) {
  requireArguments([{ name: 'password', value: password }, { name: 'salt', value: salt }, { name: 'hashedPasswordFromDb', value: hashedPasswordFromDb } ]);
  
  return bcrypt.hash(password, salt)
    .then(function(hashedPassword) {
      return hashedPasswordFromDb === hashedPassword;
    });
};

module.exports = {
  createPassword: createPassword,
  comparePassword: comparePassword
}
