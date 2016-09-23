var Promise = require('bluebird');
var rek = require('rekuire');
var setupExpress = rek('setup-express');
var routeLoader = rek('auto-load-routes');
var mongoManager = rek('mongo-manager');
var errorHandling  = rek('error-handling');


var doInitalization = function() {
  return setupExpress
          .initialize()
          .then(setupExpress.preRoutesInitalization)
          .then(mongoManager.connect)
          .then(routeLoader.createRoutes)
          .then(setupExpress.postRoutesInitalization)
          .then(setupExpress.listen)
          .catch(errorHandling.handleError);
}

module.exports.createServer = doInitalization;
