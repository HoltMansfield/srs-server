// Test dependencies
const rek = require('rekuire');
const chai = require('chai');
const sinon = require('sinon');
const boastErrors = require('boast-errors');
const request = require('supertest');
const mongoose = require('mongoose');

const expect = chai.expect;
const assert = chai.assert;

const createServerOnce = rek('create-server-once');
const mongoTestSetup = rek('mongo-test-setup');
const supertestTestSetup = rek('supertest-test-setup');


describe('express-app', () => {
  it('should load without errors', done => {
    // start the app
    createServerOnce
        .createServerOnce()
        .then(server => {
          expect(server).to.be.defined;
          done();
          runTests(server);
        })
        .catch(boastErrors.logToConsole);
  });
});

const runTests = function(server) {
  describe('tweets-routes', () => {
    const baseUrl = '/api/tweets';
    let tweets; // retain tweet data created in beforeEach
    let users; // retain users for testing relationships
    let jwt;  // jwt needed for hitting secured endpoints
    let tweetsApi; // we can't require in the tweetsApi module until the mongoose model is registered
    let usersApi; // we can't require in the usersApi module until the mongoose model is registered
    let apiUser; // the authenticated user for testing secure endpoints
    const clearTextPassword = 'clear-text-password-value'; // retain the users password to test logging in

    beforeEach(done => {
      mongoTestSetup.clearDb(mongoose)
        .then(() => {
          tweetsApi = rek('tweets-api'); // now that collections are imported require in tweetsApi
          usersApi = rek('users-api'); // now that collections are imported require in userApi
          tweets = []; //re-initalize and clear our array of tweets
          users = []; //re-initalize and clear our array of users

          createApiUser()
            // create a test data for querying against
            .then(createTestData)
            .then(() => done())
            .catch(boastErrors.logToConsole);
        })
        .catch(boastErrors.logToConsole);
    });

    const createApiUser = function() {
      // create a user for authenticating with API
      return supertestTestSetup.createTestUserAndToken(server)
        .then(userAndToken => {
          expect(userAndToken).to.have.property('user');
          expect(userAndToken).to.have.property('jwt');

          users.push(userAndToken.user);

          jwt = userAndToken.jwt;
          apiUser = userAndToken.user;

          return userAndToken;
        });
    };

    const createTestData = function() {
      return createTestTweet()
        .then(creatTestFollower);
    };

    const createTestTweet = function() {
      const testTweet = {
        tweetBody: 'Trump has the best tweets.',
        postedBy: users[0]._id
      };

      return tweetsApi.create(testTweet)
              .then(newTweet => {
                tweets.push(newTweet);
                return newTweet;
              });
    };

    const creatTestFollower = function() {
      const testFollower = {
        email: 'beforeEach-created-follower@test.com',
        password: 'testFollower',
        first: 'first-name-test-value',
        following: [] //need to initialize this to be able to push the testUser's _id
      };

      // establish the 'following' relationship
      testFollower.following.push(users[0]._id);

      return usersApi.create(testFollower)
              .then(newUser => {
                users.push(newUser);
                return newUser;
              });
    };

    afterEach(function (done) {
      mongoTestSetup.disconnect(mongoose, done);
    });

    it('should fetch a tweet using a mongo query', done => {
      // this test verifies the tweet we created in the beforeEach
      const query = { _id: tweets[0]._id };

      request(server)
        .post(baseUrl +'/query')
        .set('Authorization', 'Bearer ' +jwt)
        .send(query)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const tweetFromServer = res.body[0];

          expect(tweetFromServer.postedBy).to.equal(users[0]._id);
          expect(tweets[0]._id.equals(tweetFromServer._id)).to.equal(true);

          if (err) {
            console.log(JSON.stringify(err));
            throw err;
          }
          done();
        });
    });

    it('show a given user the tweets from the users they follow', function(done) {
      // get the tweets for the user we created in the beforeEach

      request(server)
        .post(baseUrl +'/query-for-user')
        .set('Authorization', 'Bearer ' +jwt)
        .send(users[1])
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const tweetsFromServer = res.body;

          expect(tweetsFromServer).to.be.defined;
          expect(tweetsFromServer.length).to.equal(1);

          if (err) {
            console.log(JSON.stringify(err));
            throw err;
          }
          done();
        });
    });

  });
};
