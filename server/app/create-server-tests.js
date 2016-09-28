// Test dependencies
var rek = require('rekuire');
var chai = require('chai');
var boastErrors = require('boast-errors');

var expect = chai.expect;
var assert = chai.assert;

// System Under Test
var fixture = rek('create-server-once');

describe('Create Server', () => {
  it('should have the following configuration', done => {
    assert.isDefined(fixture);

    fixture.createServerOnce()
      .then(function(app) {
        expect(app.locals.settings.port).to.equal('3000');

        done();
      })
      .catch(boastErrors.logToConsole);
  });
});
