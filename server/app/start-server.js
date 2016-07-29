/*
    This script is called directly to start the server by the node process
    Test instances start the server by calling createServer.createServer in individual integaration tests
*/

var rek = require('rekuire');
var createServer = rek('create-server');
var errorHandling  = rek('error-handling');

// set the development environment
process.env.NODE_ENV = 'development';
process.env.PORT = process.env.PORT || 3000;

// start the app
createServer
    .createServer()
    .then(function() {
      console.log('self reported study api server running');
    })
    .catch(errorHandling.handleError);
