/*
    This script is called directly to start the server

    Test instances start the server by calling
    createServerOnce.createServerOnce()
    in individual integration tests
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
    .then(() => console.log('symbilitweet api server running'))
    .catch(errorHandling.handleError);
