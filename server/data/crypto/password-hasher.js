var bcrypt = require('bcrypt-as-promised');
var Promise = require('bluebird');

// toDo: npm module (google it or make it)
var requireArguments = function(arguments) {
  arguments.forEach(function(argument) {
    // programming by contract
    if(!argument.value) throw Error('password-hasher.hash() requires ' +argument.name);
  });
};

var hashPassword = function(salt, password) {
  // use that salt to hash the password
  return bcrypt.hash(password, salt)
          .then(hashedPassword => {
            // code downstream needs the hashedPassword & the salt
            return {
              salt: salt,
              hashedPassword: hashedPassword
            };
          });
};

var createPassword = function(password) {
  requireArguments([{ name: 'password', value: password }]);

  return bcrypt.genSalt()
          .then(salt => hashPassword(salt, password));
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
  comparePassword: comparePassword,
  hashPassword: hashPassword
}
