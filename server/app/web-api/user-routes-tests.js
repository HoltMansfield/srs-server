// Test dependencies
var rek = require('rekuire');
var chai = require('chai');
var sinon = require('sinon');
var boastErrors = require('boast-errors');

var expect = chai.expect;
var assert = chai.assert;

var createServerOnce = rek('create-server-once');

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
  describe('users-api', function() {
    it('should rock', function() {
      
    });
  });
};
