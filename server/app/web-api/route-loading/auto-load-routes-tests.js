// Test dependencies
var rek = require('rekuire');
var chai = require('chai');
var sinon = require('sinon');
var boastErrors = require('boast-errors');

var expect = chai.expect;
var assert = chai.assert;


// System Under Test
var fixture = rek('auto-load-routes');


describe('auto-load-routes', function() {
  it('reads in all routes in web-api folder', sinon.test(function(done) {
    var mockApp = {
      post: function() {}
    };

    var postSpy = sinon.spy(mockApp, 'post');

    fixture.createRoutes(mockApp)
      .then(() => {
        assert(postSpy.called);
        done();
      })
      .catch(boastErrors.logToConsole);
  }));
});
