// Test dependencies
const rek = require('rekuire');
const chai = require('chai');
const sinon = require('sinon');
const boastErrors = require('boast-errors');

const expect = chai.expect;
const assert = chai.assert;

// System Under Test
const fixture = rek('mongo-manager');


describe('mongo-manager', () => {
  describe('connect', () => {
    it('should resolve promise when open callback fires', sinon.test(done => {
      fixture.connect()
        .then(app => done())
        .catch(boastErrors.logToConsole);
    }));
  });
});
