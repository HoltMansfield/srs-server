const rek = require('rekuire');

const consoleMessages = rek('console-messages');

const requestErrorHandler = function(err, req, res) {
  const validationErrors = null;

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

const errorHandler = function(err) {
  consoleMessages.error(err);
};

module.exports = {
  errorHandler: errorHandler,
  requestErrorHandler: requestErrorHandler
};
