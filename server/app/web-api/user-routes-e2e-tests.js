// Test dependencies
var rek = require('rekuire');
var chai = require('chai');
var sinon = require('sinon');
var boastErrors = require('boast-errors');
var request = require('supertest');
var mongoose = require('mongoose');

var expect = chai.expect;
var assert = chai.assert;

var createServerOnce = rek('create-server-once');
var mongoTestSetup = rek('mongo-test-setup');
var supertestTestSetup = rek('supertest-test-setup');


describe('express-app', function() {
  it('should load without errors', function(done) {
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

var runTests = function(server) {
  describe('users-routes', function() {
    var baseUrl = '/api/users';
    var users; // retain user data created in beforeEach
    var jwt;  // jwt needed for hitting secured endpoints
    var usersApi; // we can't require in the usersApi module until the mongoose model is registered
    var apiUser; // the authenticated user for testing secure endpoints

    beforeEach(function (done) {
      mongoTestSetup.clearDb(mongoose)
        .then(() => {
          usersApi = rek('users-api'); // now that collections are imported require in userApi
          users = []; //re-initalize and clear our array of users

          // create a test user for querying against
          createTestUser()
            .then(newUser => {
              users.push(newUser);
              // create a user for authenticating with API
              supertestTestSetup.createTestUserAndToken(server)
                .then(userAndToken => {
                  expect(userAndToken).to.have.property('user');
                  expect(userAndToken).to.have.property('jwt');

                  jwt = userAndToken.jwt;
                  apiUser = userAndToken.user;

                  done();
                });
            });
        });
    });

    afterEach(function (done) {
      mongoTestSetup.disconnect(mongoose, done);
    });

    var createTestUser = function() {
      var testUser = {
        email: 'beforeEach-created-user@test.com',
        password: 'password-value',
        first: 'first-name-test-value'
      };

      return usersApi.create(testUser);
    };

    it('should be obvious', function() {
      expect('derp').to.be.defined;
    });
  });
};
