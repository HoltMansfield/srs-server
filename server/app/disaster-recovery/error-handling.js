var rek = require('rekuire');

var consoleMessages = rek('console-messages');

var requestErrorHandler = function(err, req, res) {
  var validationErrors = null;

  if(err && err.errors) {
    validationErrors = err.errors;
  }

  res
  .status(422)
  .json(
  {
      success: false,
      name: err.name,
      message: err.message,
      stack: err.stack,
      validationErrors: validationErrors
  });

  if(!err.message || err.message.length === 0) {
    consoleMessages.error('EMTPY ERROR FOUND');
    consoleMessages.error('Need to investigate and refactor');
  }

  consoleMessages.error(err.message);
};

var errorHandler = function(err) {
  consoleMessages.error(err);
};

module.exports = {
  errorHandler: errorHandler
};
