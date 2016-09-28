// Test dependencies
const rek = require('rekuire');
const chai = require('chai');
const sinon = require('sinon');
const boastErrors = require('boast-errors');

const expect = chai.expect;
const assert = chai.assert;

// System Under Test
const fixture = rek('setup-express');

const handleError = function(error) {
  console.log('HANDLE ERROR:');
  console.log(error);

  throw error;
};

describe('setup-express', () => {
  describe('initialize', () => {
    it('should create an express app', done => {
      assert.isDefined(fixture);

      fixture.initialize()
        .then(app => {
          expect(app.route).to.not.be.undefined;
          expect(app.use).to.not.be.undefined;

          done();
        })
        .catch(boastErrors.logToConsole);
    });
  });
});
