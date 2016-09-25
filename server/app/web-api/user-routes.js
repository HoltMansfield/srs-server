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
      .catch((err) => errorHandling(err, req, res));
  });

  // MongoDB Find()
  app.post(baseUrl +'/query', (req, res, next) => {
    usersApi.find(req.body)
      .then(data => res.json(data))
      .catch((err) => errorHandling(err, req, res));
  });

  // Update
  app.put(baseUrl, (req, res, next) => {
    usersApi.update(req.body)
      .then(data => res.json(data))
      .catch((err) => errorHandling(err, req, res));
  });

};

module.exports = {
  createRoutes: createRoutes
}
