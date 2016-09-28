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

var getTweetsForUser = function(user) {
  var userIds = user.following;
  var query = { postedBy: { $in: userIds } };

  return Tweet.find(query);
};

var find = function(query) {
  return Tweet.find(query);
};

module.exports = {
  create: create,
  find: find,
  getTweetsForUser: getTweetsForUser
};
