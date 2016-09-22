var rek = require('rekuire');

var usersApi = rek('users-api');

var createRoutes = function(app) {
  var urlBase = '/api/users';

  app.post(urlBase +'/query', function(req, res, next) {
    usersApi.query(req.body)
      .then(function(data) {
        res.json(data);
      })
      .catch(function(err) {
        return next(err);
      });
  });

};

module.exports = {
  createRoutes: createRoutes
}
