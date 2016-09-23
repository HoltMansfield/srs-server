var rek = require('rekuire');

var usersApi = rek('users-api');

var createRoutes = function(app) {
  var baseUrl = '/api/users';

  app.post(baseUrl, (req, res, next) => {
    usersApi.create(req.body)
      /// HHH create a method for this
      .then(data => res.json(data));
  });

  // maps directly to mongo.find()
  app.post(baseUrl +'/query', (req, res, next) => {
    usersApi.find(req.body)
      .then(data => res.json(data))
      //HHH add method in error-handling for returning an error
      .catch((err) => {
        return next(err);
      });
  });

};

module.exports = {
  createRoutes: createRoutes
}
