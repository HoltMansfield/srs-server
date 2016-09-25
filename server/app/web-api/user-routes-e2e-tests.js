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

var runTests = function(server) {
  describe('users-routes', () => {
    var baseUrl = '/api/users';
    var users; // retain user data created in beforeEach
    var jwt;  // jwt needed for hitting secured endpoints
    var usersApi; // we can't require in the usersApi module until the mongoose model is registered
    var apiUser; // the authenticated user for testing secure endpoints

    beforeEach(done => {
      mongoTestSetup.clearDb(mongoose)
        .then(() => {
          usersApi = rek('users-api'); // now that collections are imported require in userApi
          users = []; //re-initalize and clear our array of users

          // create a test user for querying against
          createTestUser()
            .then(newUser => {
              users.push(newUser);

              // create an API user for hitting secure endpoints
              createApiUser()
                .then(done);
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

    var createApiUser = function() {
      // create a user for authenticating with API
      return supertestTestSetup.createTestUserAndToken(server)
        .then(userAndToken => {
          expect(userAndToken).to.have.property('user');
          expect(userAndToken).to.have.property('jwt');

          jwt = userAndToken.jwt;
          apiUser = userAndToken.user;
        });
    };

    it('should fetch a user using a mongo query', done => {
      var query = {
          email: users[0].email.toLowerCase()
      };

      request(server)
        .post(baseUrl +'/query')
        .set('Authorization', 'Bearer ' +jwt)
        .send(query)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          var userFromServer = res.body[0];

          expect(userFromServer._id).to.equal(users[0].id);

          if (err) {
            console.log(JSON.stringify(err));
            throw err;
          }
          done();
        });
    });

    it('should update a user', done => {
      var newFirstNameValue = 'update-first-name-value';;
      users[0].first = newFirstNameValue;

      request(server)
        .put(baseUrl)
        .set('Authorization', 'Bearer ' +jwt)
        .send(users[0])
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          var userFromServer = res.body;

          expect(userFromServer.first).to.equal(newFirstNameValue);

          if (err) {
            console.log(JSON.stringify(err));
            throw err;
          }
          done();
        });
    });

    it('should delete a user', done => {
      var query = {
          email: users[0].email.toLowerCase()
      };

      // delete the user
      request(server)
        .delete(baseUrl)
        .set('Authorization', 'Bearer ' +jwt)
        .send(query)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            console.log(JSON.stringify(err));
            throw err;
          }

          usersApi.find(query)
            .then(foundUser => {
              // assert that the user can't be found after deletion
              expect(foundUser.length).to.equal(0);
              done();
            });
        });
    });
  });
};
