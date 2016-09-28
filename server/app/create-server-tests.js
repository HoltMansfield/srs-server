// Test dependencies
const rek = require('rekuire');
const chai = require('chai');
const boastErrors = require('boast-errors');

const expect = chai.expect;
const assert = chai.assert;

// System Under Test
const fixture = rek('create-server-once');

describe('Create Server', () => {
  it('should have the following configuration', done => {
    assert.isDefined(fixture);

    fixture.createServerOnce()
      .then(app => {
        expect(app.locals.settings.port).to.equal('3000');

        done();
      })
      .catch(boastErrors.logToConsole);
  });
});
