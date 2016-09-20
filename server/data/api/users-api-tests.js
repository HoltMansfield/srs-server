// Test dependencies
var rek = require('rekuire');
var chai = require('chai');
var sinon = require('sinon');
var mongoose = require('mongoose');
var boastErrors = require('boast-errors');

var mongoTestSetup = rek('mongo-test-setup');

var expect = chai.expect;
var assert = chai.assert;

var collections = rek('collection-manager');

// test fixture requires user model
collections.importCollections();
var User = mongoose.model('User');

// System Under Test
var fixture = rek('users-api');


describe('users-api', function() {
  var testUser; var testUserPassword = 'test-user-password';

  var createTestUser = function(user) {
    return fixture.createUser(user);
  };

  beforeEach(function (done) {
    testUser = {
      email: 'beforeEach-created-user@test.com',
      password: testUserPassword
    };

    mongoTestSetup.clearDb(mongoose)
                    .then(() => createTestUser(testUser))
                    .then(testUserFromDb => {
                      testUser = testUserFromDb;
                      done();
                    });
  });

  afterEach(function (done) {
    mongoTestSetup.disconnect(mongoose, done);
  });

  it('createUser returns user with ID', function(done) {
    var clearTextPassword = 'mama';
    var mixedCaseEmail = 'tesT@tesT.com';

    var user = {
      email: mixedCaseEmail,
      password: clearTextPassword
    };

    fixture.createUser(user)
      .then(function(userFromDb) {
        expect(userFromDb.salt).to.be.defined;
        expect(userFromDb.password).to.not.equal(clearTextPassword);
        expect(user.email).to.not.equal(mixedCaseEmail);
        done();
      })
      .catch(boastErrors.logToConsole);
  });

  it('authenticateUser returns true for valid attempt', function(done) {
    // our beforeEach creates a test user we can query against

    fixture.authenticateUser(testUser.email, testUserPassword)
      .then(function(authenticationResult) {
        expect(authenticationResult).to.equal(true);
        done();
      })
      .catch(boastErrors.logToConsole);
  });

  it('findUser returns user for valid query', function(done) {
    // our beforeEach creates a test user we can query against
    var query = { _id: testUser.id };

    fixture.findUser(query)
      .then(function(foundUser) {
        expect(foundUser).to.be.defined;
        expect(foundUser.id).to.be.defined;
        expect(foundUser.id).to.equal(testUser.id);
        done();
      })
      .catch(boastErrors.logToConsole);
  });
});
