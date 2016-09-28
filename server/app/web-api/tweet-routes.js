var jwt = require('jsonwebtoken');
var rek = require('rekuire');

var tweetsApi = rek('tweets-api');
var errorHandling = rek('error-handling');

var createRoutes = function(app) {
  var baseUrl = '/api/tweets';

  // Create
  app.post(baseUrl, (req, res, next) => {
    tweetsApi.create(req.body)
      .then(newTweet => res.json(newTweet))
      .catch((err) => errorHandling.requestErrorHandler(err, req, res));
  });

  // Find
  app.post(baseUrl +'/query', (req, res, next) => {
    tweetsApi.find(req.body)
      .then(results => res.json(results))
      .catch((err) => errorHandling.requestErrorHandler(err, req, res));
  });

  // Find for user
  app.post(baseUrl +'/query-for-user', (req, res, next) => {
    tweetsApi.getTweetsForUser(req.body)
      .then(results => res.json(results))
      .catch((err) => errorHandling.requestErrorHandler(err, req, res));
  });

};

module.exports = {
  createRoutes: createRoutes
}
