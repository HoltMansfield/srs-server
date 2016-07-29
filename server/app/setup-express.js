var Promise = require('bluebird');
var rek = require('rekuire');
var express    = require('express');
var expressJwt = require('express-jwt');
var errorHandling  = rek('error-handling');

// the first method called during server startup
var initialize = function() {
  return new Promise(function(resolve, reject) {
    var app = express();

    resolve(app);
  });
};

// Middleware that needs to be configured BEFIRE routes are created
var preRoutesInitalization = function(app) {
    return new Promise(function(resolve, reject) {
        // parse all urls for JWT except route included in 'path' below
        app.use(expressJwt({ secret: 'toDo: use cert'})
                            .unless({
                            path:
                            [
                                { url: '/api/admins/login', methods: ['POST']  },
                                { url: '/api/users', methods: ['POST']  },
                                { url: '/', methods: ['GET']  },
                            ],
                            }));

        resolve(app);
    });
};

// Middleware that needs to be configured AFTER routes are created
var postRoutesInitalization = function(app) {
    return new Promise(function(resolve, reject) {
        /*
            api route handlers are the entry point to this api-server
            the route handlers use tight promise chains and handle their own errors

            nothing should ever bubble up to this global error handler
            if it does, this error handler is here to let us know we have a leak in our promise chains/error handling
        */
        app.use(errorHandling.requestErrorHandler);

        resolve(app);
    });
};

// The actual http listener
var listen = function(app) {
  return new Promise(function(resolve, reject) {
    // default port
    process.env.PORT = process.env.PORT || 3000;

    // default to the development environment
    process.env.NODE_ENV = 'development';

    app.set('port', process.env.PORT);

    app.listen(app.get('port'), function() {
       resolve(app);
    });
  });
};

// note: routes are created in: /server/routes/load-routes
module.exports = {
  initialize: initialize,
  preRoutesInitalization: preRoutesInitalization,
  postRoutesInitalization: postRoutesInitalization,
  listen: listen
};
