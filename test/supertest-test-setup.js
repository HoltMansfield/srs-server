// Test dependencies
var rek = require('rekuire');
var chai = require('chai');
var sinon = require('sinon');
var boastErrors = require('boast-errors');
var request = require('supertest');

var expect = chai.expect;
var assert = chai.assert;


var runTests = function(resolve, reject, server) {
  var baseUrl = '/api/users';

  var testUser = {
    email: 'post-user-created-user@test.com',
    password: 'password-value',
    first: 'first-name-test-value'
  };

  request(server)
    .post(baseUrl)
    .send(testUser)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      var responseBody = res.body;

      if (err) {
        console.log(JSON.stringify(err));
        reject(err);
      }

      // beforeEach in user-routes-e2e-tests.js does a weak assertion on this response
      resolve(responseBody);
    });
};

var createTestUserAndToken = function(server) {
  return new Promise((resolve, reject) => {
    runTests(resolve, reject, server);
  });
};


module.exports = {
  createTestUserAndToken: createTestUserAndToken
}
