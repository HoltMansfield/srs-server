// Test dependencies
const rek = require('rekuire');
const chai = require('chai');
const sinon = require('sinon');
const boastErrors = require('boast-errors');
const request = require('supertest');
const mongoose = require('mongoose');

const expect = chai.expect;
const assert = chai.assert;

const createServerOnce = rek('create-server-once');
const mongoTestSetup = rek('mongo-test-setup');
const supertestTestSetup = rek('supertest-test-setup');


describe('express-app', () => {
  it('should load without errors', done => {
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

const runTests = function(server) {
  describe('users-routes', () => {
    const baseUrl = '/api/users';
    let users; // retain user data created in beforeEach
    let jwt;  // jwt needed for hitting secured endpoints
    let usersApi; // we can't require in the usersApi module until the mongoose model is registered
    let apiUser; // the authenticated user for testing secure endpoints
    const clearTextPassword = 'clear-text-password-value'; // retain the users password to test logging in

    beforeEach(done => {
      mongoTestSetup.clearDb(mongoose)
        .then(() => {
          usersApi = rek('users-api'); // now that collections are imported require in userApi
          users = []; //re-initalize and clear our array of users

          // create a test user for querying against
          createTestUser()
            .then(newUser => {
              users.push(newUser);

              // create an API user for hitting secure endpoints
              createApiUser()
                .then(done);
            });
        });
    });

    afterEach(function (done) {
      mongoTestSetup.disconnect(mongoose, done);
    });

    const createTestUser = function() {
      const testUser = {
        email: 'beforeEach-created-user@test.com',
        password: clearTextPassword,
        first: 'first-name-test-value'
      };

      return usersApi.create(testUser);
    };

    const createApiUser = function() {
      // create a user for authenticating with API
      return supertestTestSetup.createTestUserAndToken(server)
        .then(userAndToken => {
          expect(userAndToken).to.have.property('user');
          expect(userAndToken).to.have.property('jwt');

          jwt = userAndToken.jwt;
          apiUser = userAndToken.user;
        });
    };

    it('should fetch a user using a mongo query', done => {
      const query = {
          email: users[0].email.toLowerCase()
      };

      request(server)
        .post(baseUrl +'/query')
        .set('Authorization', 'Bearer ' +jwt)
        .send(query)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const userFromServer = res.body[0];

          expect(userFromServer._id).to.equal(users[0].id);

          if (err) {
            console.log(JSON.stringify(err));
            throw err;
          }
          done();
        });
    });

    it('should update a user', done => {
      const newFirstNameValue = 'update-first-name-value';;
      users[0].first = newFirstNameValue;

      request(server)
        .put(baseUrl)
        .set('Authorization', 'Bearer ' +jwt)
        .send(users[0])
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const userFromServer = res.body;

          expect(userFromServer.first).to.equal(newFirstNameValue);

          if (err) {
            console.log(JSON.stringify(err));
            throw err;
          }
          done();
        });
    });

    it('should delete a user', done => {
      const query = {
          email: users[0].email.toLowerCase()
      };

      // delete the user
      request(server)
        .delete(baseUrl)
        .set('Authorization', 'Bearer ' +jwt)
        .send(query)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            console.log(JSON.stringify(err));
            throw err;
          }

          usersApi.find(query)
            .then(foundUser => {
              // assert that the user can't be found after deletion
              expect(foundUser.length).to.equal(0);
              done();
            });
        });
    });

    it('should authenticate a user', done => {
      const loginAttempt = {
          email: users[0].email.toLowerCase(),
          password: clearTextPassword,
      };

      // authenticate the user
      request(server)
        .post(baseUrl +'/authenticate')
        .send(loginAttempt)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            console.log(JSON.stringify(err));
            throw err;
          }

          const responseValue = res.body;

          expect(responseValue).to.equal(true);
          done();
        });
    });

    it('should update a users password', done => {
      const updatedPassword = clearTextPassword +'updated';
      const updatePasswordAttempt = {
          _id: users[0]._id,
          password: updatedPassword,
          salt: users[0].salt
      };

      // authenticate the user
      request(server)
        .post(baseUrl +'/update-password')
        .set('Authorization', 'Bearer ' +jwt)
        .send(updatePasswordAttempt)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            console.log(JSON.stringify(err));
            throw err;
          }

          const updatedUser = res.body;

          expect(updatedUser).to.be.defined;
          expect(updatedUser.password).to.be.defined;
          // need to assert hasher.hashPassword was called, & findByIdAndUpdate was called
          expect(updatedUser.password).to.not.equal(updatedPassword);

          done();
        });
    });

  });
};
