// Test dependencies
const rek = require('rekuire');
const chai = require('chai');
const sinon = require('sinon');
const boastErrors = require('boast-errors');

const expect = chai.expect;
const assert = chai.assert;


// System Under Test
const fixture = rek('auto-load-routes');


describe('auto-load-routes', () => {
  it('reads in all routes in web-api folder', sinon.test(done => {
    const mockApp = {
      post: function() {},
      put: function() {},
      get: function() {},
      delete: function() {},
      patch: function() {}
    };

    const postSpy = sinon.spy(mockApp, 'post');

    fixture.createRoutes(mockApp)
      .then(() => {
        assert(postSpy.called);
        done();
      })
      .catch(boastErrors.logToConsole);
  }));
});
