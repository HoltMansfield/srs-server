var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');

var Schema       = mongoose.Schema;
var collectionsImported = false;

var createCollection = function(file) {
  var modelName = file.replace('.js','');
  var modulePath = './collections/' +modelName;

  // require in the module for this collection
  var modelModule = require(modulePath);

  // register the schema with mongoose
  modelModule.register();
};

var importCollections = function() {
  if(!collectionsImported) {
    var srcpath = __dirname +'/collections';

    fs.readdirSync(srcpath).filter(function(file) {
      createCollection(file);
    });

    collectionsImported = true;
  }
};

module.exports = {
  importCollections: importCollections,
};
