var Promise = require('bluebird');
var mongoose = require('mongoose');
var rek = require('rekuire');


var Tweet = mongoose.model('Tweet');

var create = function(tweet) {
  // create mongoose model
  var tweetModel = new Tweet(tweet);

  // promise chain continues
  return tweetModel.save();
};


module.exports = {
  create: create
};
