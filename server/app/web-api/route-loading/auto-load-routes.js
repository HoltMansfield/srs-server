var Promise = require('bluebird');
var rek = require('rekuire');
var fs = require('fs');

var ignore = [
  'auto-load-routes',
  'auto-load-routes-tests'
];

var checkRoute = function(file) {
  var rc = false;

  // path has a .js extension ie it's not a folder
  if(file && file.indexOf('.js') != -1) {
    if(!ignore.find(ignorePath => ignorePath === file)) {
      rc = true;
    }
  }

  return rc;
};

var importRoutes = function(file, app) {
  if(checkRoute(file)) {
      var moduleName = file.replace('.js','');
      var routeModule = rek(moduleName);

      routeModule.createRoutes(app);
  }
};

var createRoutes = function(app) {
  return new Promise(function(resolve, reject) {
    var srcpath = __dirname +'/..';

    fs.readdirSync(srcpath).filter(function(file) {
      importRoutes(file, app);
    });

    resolve(app);
  });
};

module.exports = {
  createRoutes: createRoutes
};
