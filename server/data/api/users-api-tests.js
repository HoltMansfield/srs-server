// Test dependencies
var rek = require('rekuire');
var chai = require('chai');
var sinon = require('sinon');
var boastErrors = require('boast-errors');

var mongoTestSetup = require('../mongo-test-setup');

var expect = chai.expect;
var assert = chai.assert;

// System Under Test
var fixture = rek('setup-express');


describe('users-api', function() {
  beforeEach(function (done) {
    mongoTestSetup.clearDb(mongoose, done);
  });

  afterEach(function (done) {
    testSetup.disconnect(mongoose, done);
  });

  it('createUser returns user with ID', function() {
    var user = {

    };

    fixture.createUser(user)
      .then(function(userFromDb) {
        expect(userFromDb._id).to.not.be.undefined;
      })
      .catch(boastErrors.logToConsole);
  });
});
