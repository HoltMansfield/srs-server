// Test dependencies
const rek = require('rekuire');
const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const boastErrors = require('boast-errors');

const mongoTestSetup = rek('mongo-test-setup');

const expect = chai.expect;
const assert = chai.assert;


// System Under Test
let fixture; // require this after the schema is registered
let usersApi; // require this after the schema is registered


describe('tweets-api', () => {
  let tweets;
  let users;

  const createTestTweet = function() {
    const testTweet = {
      tweetBody: 'Trump loses by largest margin in US History',
      postedBy: users[0]._id
    };

    return fixture.create(testTweet);
  };

  const createTestUsers = function() {
    const testUser = {
      email: 'beforeEach-created-user@test.com',
      password: 'testUser',
      first: 'first-name-test-value'
    };

    const testFollower = {
      email: 'beforeEach-created-follower@test.com',
      password: 'testFollower',
      first: 'first-name-test-value',
      following: [] //need to initialize this to be able to push the testUser's _id
    };

    return usersApi.create(testUser)
      .then(testUserFromDb => {
        users.push(testUserFromDb);

        // establish the 'following' relationship
        testFollower.following.push(testUserFromDb._id);

        return usersApi.create(testFollower)
          .then(testFollowerFromDb => {
            users.push(testFollowerFromDb);
            return testFollowerFromDb;
          });
      });
  };

  const createTestData = function() {
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

  it('creates ands queries a tweet', done => {
    // this test verifies the tweet we created in the beforeEach
    const query = { _id: tweets[0]._id };

    fixture.find(query)
      .then(results => {
        expect(results.length).to.equal(1);
        // mongos solution for id comparison
        expect(results[0]._id.equals(tweets[0]._id)).to.be.true;

        done();
      })
    .catch(boastErrors.logToConsole);
  });

  it('show a given user the tweets from the users they follow', done => {
    // get the tweet created in beforeEach

    fixture.getTweetsForUser(users[1])
      .then(tweetsFromDb => {
        expect(tweetsFromDb).to.be.defined;
        expect(tweetsFromDb.length).to.equal(1);

        done();
      });
  });

  it('show a given user their followers', done => {
    // get the followers for testUser create in beforeEach

    /*
      this test should be moved to the usersApi test suite
      it's here as a basic sanity test that the data model is viable
    */

    // get all users that follow the testUser
    const query = { following: users[0]._id };

    usersApi.find(query)
      .then(followersFromDb => {
        expect(followersFromDb).to.be.defined;
        expect(followersFromDb.length).to.equal(1);
        expect(followersFromDb[0]._id.equals(users[1]._id));

        done();
      });
  });
});
