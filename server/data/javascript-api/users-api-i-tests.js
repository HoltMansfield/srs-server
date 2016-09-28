// Test dependencies
const rek = require('rekuire');
const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const boastErrors = require('boast-errors');

const mongoTestSetup = rek('mongo-test-setup');

const expect = chai.expect;
const assert = chai.assert;


// System Under Test
let fixture; // require this after the Model is registered


describe('users-api', () => {
  let testUser; let testUserPassword = 'test-user-password';

  const createTestUser = function() {
    // now that our mongoose schemas are registered
    fixture = rek('users-api');

    testUser = {
      email: 'beforeEach-created-user@test.com',
      password: testUserPassword,
      first: 'first-name-test-value'
    };

    return fixture.create(testUser);
  };

  beforeEach(function (done) {
    mongoTestSetup.clearDb(mongoose)
                    .then(() => {
                      return createTestUser();
                    })
                    .then(testUserFromDb => {
                      //read in the ID only so we keep testUser as a POJO
                      testUser._id = testUserFromDb.id;
                      testUser.salt = testUser.salt;

                      done();
                    });
  });

  afterEach(function (done) {
    mongoTestSetup.disconnect(mongoose, done);
  });

  it('createUser returns user with ID', done => {
    const clearTextPassword = 'mama';
    const mixedCaseEmail = 'tesT@tesT.com';

    const user = {
      email: mixedCaseEmail,
      password: clearTextPassword
    };

    fixture.create(user)
      .then(userFromDb => {
        expect(userFromDb.salt).to.be.defined;
        expect(userFromDb.password).to.not.equal(clearTextPassword);
        expect(user.email).to.not.equal(mixedCaseEmail);
        done();
      })
      .catch(boastErrors.logToConsole);
  });

  it('authenticateUser returns true for valid attempt', done => {
    // our beforeEach creates a test user we can query against

    fixture.authenticateUser({
        email: testUser.email,
        password: testUserPassword
      })
      .then(authenticationResult => {
        expect(authenticationResult).to.equal(true);
        done();
      })
      .catch(boastErrors.logToConsole);
  });

  it('findUser returns user for valid query', done => {
    // our beforeEach creates a test user we can query against
    const query = { _id: testUser._id };

    fixture.find(query)
      .then(foundUsers => {
        expect(foundUsers[0]).to.be.defined;
        expect(foundUsers[0].id).to.be.defined;
        expect(foundUsers[0].id).to.equal(testUser._id);
        done();
      })
      .catch(boastErrors.logToConsole);
  });

  it('updates any fields on the user', done => {
    // our beforeEach creates a test user we can query against
    const updatedName = testUser.first +'-updated-value';
    const udpatedPassword = 'new-password-value';

    testUser.first = updatedName;
    testUser.password = udpatedPassword;

    // update the user
    fixture.update(testUser)
      .then(() => {
        const query = { _id: testUser._id };

        // fetch the user back from the DB
        fixture.find(query)
          .then(foundUsers => {
            expect(foundUsers).to.be.defined;
            expect(foundUsers[0].first).to.be.defined;
            expect(foundUsers[0].first).to.equal(updatedName);
            expect(foundUsers[0].password).to.not.equal(udpatedPassword)
            done();
          });
      })
      .catch(boastErrors.logToConsole);
  });

  it('updates JUST the password field on the user', done => {
    // our beforeEach creates a test user we can query against
    const udpatedPassword = 'new-password-value';

    testUser.password = udpatedPassword;

    // update the user
    fixture.updatePassword(testUser)
      .then(() => {
        const query = { _id: testUser.id };

        // fetch the user back from the DB
        fixture.find(query)
          .then(foundUser => {
            expect(foundUser).to.be.defined;
            expect(foundUser.password).to.be.defined;
            expect(foundUser.password).to.not.equal(udpatedPassword)
            done();
          });
      })
      .catch(boastErrors.logToConsole);
  });

  it('deletes the user', done => {
    // our beforeEach creates a test user we can query against
    const query = { _id: testUser.id };

    fixture.delete(query)
      .then(() => {

        // fetch the user back from the DB
        fixture.find(query)
          .then(foundUser => {
            expect(foundUser).to.not.be.defined;
            done();
          });
      })
      .catch(boastErrors.logToConsole);
  });
});
