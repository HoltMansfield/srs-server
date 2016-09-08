// Test dependencies
var rek = require('rekuire');
var chai = require('chai');
var sinon = require('sinon');
var boastErrors = require('boast-errors');

var expect = chai.expect;
var assert = chai.assert;

// System Under Test
var fixture = rek('mongo-manager');


describe('mongo-manager', function() {
  describe('connect', function() {

    // This is an integration test //

    // It requies a mongodb instance and a correct connection string in config/test.json

    it('should resolve promise when open callback fires', sinon.test(function(done) {
      fixture.connect()
        .then(function(createPasswordResult) {
          done();
        })
        .catch(boastErrors.logToConsole);
    }));
  });
});
