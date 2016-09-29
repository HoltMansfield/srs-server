const jwt = require('jsonwebtoken');
const rek = require('rekuire');

const usersApi = rek('users-api');
const errorHandling = rek('error-handling');


const createRoutes = function(app) {
  const baseUrl = '/api/users';

  // Create
  app.post(baseUrl, (req, res, next) => {
    usersApi.create(req.body)
      .then(newUser => {
        const token = jwt.sign(newUser, 'toDo: use cert');

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
