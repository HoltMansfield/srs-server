var Promise = require('bluebird');
var rek = require('rekuire');
var fs = require('fs');

var ignore = [
  'auto-load-routes',
  'auto-load-routes-tests'
];

var checkRoute = function(file) {
  var shouldImportRoute = false;

  // file is not null
  if(file
    // path has a .js extension ie it's not a folder
    && file.indexOf('.js') != -1
    // file is not a test suite
    && file.indexOf('-tests.js') === -1
    // file is not in array of ignorePaths
    && !ignore.find(ignorePath => ignorePath === file))
  {
    // all is well, read in these routes
    shouldImportRoute = true;
  }

  return shouldImportRoute;
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
