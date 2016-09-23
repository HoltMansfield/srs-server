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

    beforeEach(function (done) {
      mongoTestSetup.clearDb(mongoose)
        .then(() => {
          usersApi = rek('users-api'); // now that collections are imported require in userApi
          users = []; //re-initalize and clear our array of users

          createTestUser()
            .then(newUser => {
              users.push(newUser);
              done();
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

    var testUser = {
      email: 'post-user-created-user@test.com',
      password: 'password-value',
      first: 'first-name-test-value'
    };

    it('should post a user and recieve a usable JWT', function(done) {
      request(server)
        .post(baseUrl)
        .send(testUser)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          var userFromServer = res.body;

          expect(userFromServer._id).to.be.defined;

          if (err) {
            console.log(JSON.stringify(err));
            throw err;
          }
          done();
        });
    });

    // it('should fetch a user using a mongo query', function(done) {
    //   request(server)
    //     .post(baseUrl +'/query')
    //     //.set('Authorization', 'Bearer ' +jwt)
    //     .send({
    //       email: users[0].email.toLowerCase() // downside of lower-caseing emails is client code needs to do this also
    //     })
    //     .expect('Content-Type', /json/)
    //     .expect(200)
    //     .end(function(err, res){
    //       var userFromServer = res.body[0];
    //
    //       expect(userFromServer._id).to.equal(admins[0].id);
    //
    //       if (err) {
    //         console.log(JSON.stringify(err));
    //         throw err;
    //       }
    //       done();
    //     });
    // });
  });
};
