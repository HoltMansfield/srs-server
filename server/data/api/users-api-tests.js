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
var fixture = rek('users-api');


describe('users-api', function() {
  beforeEach(function (done) {
    mongoTestSetup.clearDb(mongoose, done);
  });

  afterEach(function (done) {
    mongoTestSetup.disconnect(mongoose, done);
  });

  it('createUser returns user with ID', function() {
    var user = {

    };

    fixture.createUser(user)
      .then(function() {

      })
      .catch(boastErrors.logToConsole);
  });
});
