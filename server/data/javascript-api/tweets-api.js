const Promise = require('bluebird');
const mongoose = require('mongoose');
const rek = require('rekuire');


const Tweet = mongoose.model('Tweet');

const create = function(tweet) {
  // create mongoose model
  const tweetModel = new Tweet(tweet);

  // promise chain continues
  return tweetModel.save();
};

const getTweetsForUser = function(user) {
  const userIds = user.following;
  const query = { postedBy: { $in: userIds } };

  return Tweet.find(query);
};

const find = function(query) {
  return Tweet.find(query);
};

module.exports = {
  create: create,
  find: find,
  getTweetsForUser: getTweetsForUser
};
