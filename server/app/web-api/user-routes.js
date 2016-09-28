var jwt = require('jsonwebtoken');
var rek = require('rekuire');

var usersApi = rek('users-api');
var errorHandling = rek('error-handling');

var createRoutes = function(app) {
  var baseUrl = '/api/users';

  // Create
  app.post(baseUrl, (req, res, next) => {
    usersApi.create(req.body)

      .then(newUser => {
        var token = jwt.sign(newUser, 'toDo: use cert');

        return res.json({
          user: newUser,
          jwt: token
        });
      })
      .catch((err) => errorHandling.requestErrorHandler(err, req, res));
  });

  // MongoDB Find()
  app.post(baseUrl +'/query', (req, res, next) => {
    usersApi.find(req.body)
      .then(data => res.json(data))
      .catch((err) => errorHandling.requestErrorHandler(err, req, res));
  });

  // Update
  app.put(baseUrl, (req, res, next) => {
    usersApi.update(req.body)
      .then(data => res.json(data))
      .catch((err) => errorHandling.requestErrorHandler(err, req, res));
  });

  // Delete
  app.delete(baseUrl, (req, res, next) => {
    usersApi.delete(req.body)
      .then(data => res.json(data))
      .catch((err) => errorHandling.requestErrorHandler(err, req, res));
  });

  // Login
  app.post(baseUrl +'/authenticate', (req, res, next) => {
    usersApi.authenticateUser(req.body)
      .then(data => res.json(data))
      .catch((err) => errorHandling.requestErrorHandler(err, req, res));
  });

  // Update Password
  app.post(baseUrl +'/update-password', (req, res, next) => {
    usersApi.updatePassword(req.body)
      .then(data => res.json(data))
      .catch((err) => errorHandling.requestErrorHandler(err, req, res));
  });

};

module.exports = {
  createRoutes: createRoutes
}
