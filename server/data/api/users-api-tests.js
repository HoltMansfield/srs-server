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
    return fixture.create(user);
  };

  beforeEach(function (done) {
    testUser = {
      email: 'beforeEach-created-user@test.com',
      password: testUserPassword,
      first: 'first-name-test-value'
    };

    mongoTestSetup.clearDb(mongoose)
                    .then(() => createTestUser(testUser))
                    .then(testUserFromDb => {
                      //read in the ID only so we keep testUser as a POJO
                      testUser.id = testUserFromDb.id;
                      testUser.salt = testUser.salt;
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

    fixture.create(user)
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

    fixture.find(query)
      .then(function(foundUser) {
        expect(foundUser).to.be.defined;
        expect(foundUser.id).to.be.defined;
        expect(foundUser.id).to.equal(testUser.id);
        done();
      })
      .catch(boastErrors.logToConsole);
  });

  it('updates any fields on the user', function(done) {
    // our beforeEach creates a test user we can query against
    var updatedName = testUser.first +'-updated-value';
    var udpatedPassword = 'new-password-value';

    testUser.first = updatedName;
    testUser.password = udpatedPassword;

    // update the user
    fixture.update(testUser)
      .then(function() {
        var query = { _id: testUser.id };

        // fetch the user back from the DB
        fixture.find(query)
          .then(foundUser => {
            expect(foundUser).to.be.defined;
            expect(foundUser.first).to.be.defined;
            expect(foundUser.first).to.equal(updatedName);
            expect(foundUser.password).to.not.equal(udpatedPassword)
            done();
          });
      })
      .catch(boastErrors.logToConsole);
  });

  it('updates JUST the password field on the user', function(done) {
    // our beforeEach creates a test user we can query against
    var udpatedPassword = 'new-password-value';

    testUser.password = udpatedPassword;

    // update the user
    fixture.updatePassword(testUser)
      .then(function() {
        var query = { _id: testUser.id };

        // fetch the user back from the DB
        fixture.find(query)
          .then(foundUser => {
            expect(foundUser).to.be.defined;
            expect(foundUser.password).to.be.defined;
            expect(foundUser.password).to.not.equal(udpatedPassword)
            done();
          });
      })
      .catch(boastErrors.logToConsole);
  });

  it('deletes the user', function(done) {
    // our beforeEach creates a test user we can query against
    var query = { _id: testUser.id };

    fixture.delete(query)
      .then(function() {

        // fetch the user back from the DB
        fixture.find(query)
          .then(foundUser => {
            expect(foundUser).to.not.be.defined;
            done();
          });
      })
      .catch(boastErrors.logToConsole);
  });
});
