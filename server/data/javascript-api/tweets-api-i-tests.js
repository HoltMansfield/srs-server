// Test dependencies
var rek = require('rekuire');
var chai = require('chai');
var sinon = require('sinon');
var mongoose = require('mongoose');
var boastErrors = require('boast-errors');

var mongoTestSetup = rek('mongo-test-setup');

var expect = chai.expect;
var assert = chai.assert;


// System Under Test
var fixture; // require this after the schema is registered
var usersApi; // require this after the schema is registered


describe('tweets-api', () => {
  var tweets;
  var users;

  var createTestTweet = function() {
    var testTweet = {
      tweetBody: 'Trump loses by largest margin in US History',
      postedBy: users[0]._id
    };

    return fixture.create(testTweet);
  };

  var createTestUsers = function() {
    var testUser = {
      email: 'beforeEach-created-user@test.com',
      password: 'testUser',
      first: 'first-name-test-value'
    };

    var testFollower = {
      email: 'beforeEach-created-follower@test.com',
      password: 'testFollower',
      first: 'first-name-test-value',
      following: [] //need to initialize this to be able to push the testUser's _id
    };

    return usersApi.create(testUser)
      .then(testUserFromDb => {
        users.push(testUserFromDb);

        // establish the 'following' relationship
        testFollower.following.push(testUser._id);

        return usersApi.create(testFollower)
          .then(testFollowerFromDb => {
            users.push(testFollowerFromDb);
            return testFollowerFromDb;
          });
      });
  };

  var createTestData = function() {
    return createTestUsers()
      .then(createTestTweet);
  };

  beforeEach(function (done) {
    tweets = []; // cleanup between tests
    users = [];

    mongoTestSetup.clearDb(mongoose)
                    .then(() => {
                      fixture = rek('tweets-api');
                      usersApi = rek('users-api');

                      return createTestData();
                    })
                    .then(testTweetFromDb => {
                      tweets.push(testTweetFromDb);

                      done();
                    });
  });

  it('creates ands queries a tweet', function(done) {
    // this test verifies the tweet we created in the beforeEach
    var query = { _id: tweets[0]._id };

    fixture.find(query)
      .then(results => {
        expect(results.length).to.equal(1);
        // mongos solution for id comparison
        expect(results[0]._id.equals(tweets[0]._id)).to.be.true;

        done();
      })
    .catch(boastErrors.logToConsole);
  });

  it('show a given user the tweets from the users they follow', function(done) {
    // get the tweet created in beforeEach

    fixture.getTweetsForUser(users[0])
      .then(tweetsFromDb => {
        expect(tweetsFromDb).to.be.defined;
        expect(tweetsFromDb.length).to.equal(1);

        done();
      });
  });
});
