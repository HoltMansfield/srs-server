/*
    This script is called directly to start the server when we're running this as a webserver

    Test instances start the server by calling
    createServerOnce.createServerOnce()
    in individual integration tests
*/

const rek = require('rekuire');
const createServer = rek('create-server');
const errorHandling  = rek('error-handling');

// set the development environment
process.env.NODE_ENV = 'development';
process.env.PORT = process.env.PORT || 3000;

// start the app
createServer
    .createServer()
    .then(() => console.log('symbilitweet api server running'))
    .catch(errorHandling.handleError);
