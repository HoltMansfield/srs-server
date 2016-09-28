const jwt = require('jsonwebtoken');
const rek = require('rekuire');

const tweetsApi = rek('tweets-api');
const errorHandling = rek('error-handling');

const createRoutes = function(app) {
  const baseUrl = '/api/tweets';

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
