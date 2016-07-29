/*
    We have a series of test suites that test directly against an instance of this express application,
    this ensures we only create the server once
*/

var Promise = require('bluebird');
var rek = require('rekuire');
var createServer = rek('create-server');
var errorHandling  = rek('error-handling');

var server;

var captureServerInstance = function(serverInstance) {
  server = serverInstance;

  return serverInstance;
};

var doCreateServerOnce = function() {
  return createServer
          .createServer(server)
          .then(captureServerInstance)
          .catch(errorHandling.handleError);
};

module.exports.createServerOnce = function() {
  // if the server has already been created
  if(server) {
    // return it
    return Promise.resolve(server);
  } else {
    // serer has not been created, create it now
    return doCreateServerOnce();
  }  
};