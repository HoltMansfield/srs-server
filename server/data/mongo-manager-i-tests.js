// Test dependencies
var rek = require('rekuire');
var chai = require('chai');
var sinon = require('sinon');
var boastErrors = require('boast-errors');

var expect = chai.expect;
var assert = chai.assert;

// System Under Test
var fixture = rek('mongo-manager');


describe('mongo-manager', () => {
  describe('connect', () => {
    it('should resolve promise when open callback fires', sinon.test(done => {
      fixture.connect()
        .then(function(createPasswordResult) {
          done();
        })
        .catch(boastErrors.logToConsole);
    }));
  });
});
