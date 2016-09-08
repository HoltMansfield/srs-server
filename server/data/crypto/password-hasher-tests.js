// Test dependencies
var rek = require('rekuire');
var chai = require('chai');
var sinon = require('sinon');
var boastErrors = require('boast-errors');

var expect = chai.expect;
var assert = chai.assert;

// System Under Test
var fixture = rek('password-hasher');

// require so we can stub/spy
var bcrypt = require('bcrypt-as-promised');

describe('password-hasher', function() {
  describe('createPassword', function() {
    it('should call bcrypt to create a salt and to hash the users password', sinon.test(function(done) {
      var bcryptHashSpy = this.spy(bcrypt, 'hash');
      var bcryptSaltSpy = this.spy(bcrypt, 'genSalt');

      assert.isDefined(fixture);
      var password = 'clear-text';

      fixture.createPassword(password)
        .then(function(createPasswordResult) {
          assert.isDefined(createPasswordResult.salt);
          assert.isDefined(createPasswordResult.hashedPassword);

          sinon.assert.callCount(bcryptHashSpy, 1);
          sinon.assert.callCount(bcryptSaltSpy, 1);

          done();
        })
        .catch(boastErrors.logToConsole);
    }));

    it('should throw an error when the password is not provided', sinon.test(function() {
      expect(fixture.createPassword.bind(fixture)).to.throw();
    }));
  });

  describe('comparePassword', function() {
    it('should return true when the user enters a valid password', function(done) {
      var clearTextPassword = 'mock-password';

      fixture.createPassword(clearTextPassword)
        .then(function(createPasswordResult) {
          fixture.comparePassword(clearTextPassword, createPasswordResult.salt, createPasswordResult.hashedPassword)
            .then(function(comparePasswordResult) {
              expect(comparePasswordResult).to.equal(true);

              done();
            })
            .catch(boastErrors.logToConsole);
        })
        .catch(boastErrors.logToConsole);
    });

    it('should return FALSE when the user enters an INVALID password', function(done) {
      var clearTextPassword = 'mock-password';

      fixture.createPassword(clearTextPassword)
        .then(function(createPasswordResult) {
          fixture.comparePassword('invalid-password-attempt', createPasswordResult.salt, createPasswordResult.hashedPassword)
            .then(function(comparePasswordResult) {
              expect(comparePasswordResult).to.equal(false);

              done();
            })
            .catch(boastErrors.logToConsole);
        })
        .catch(boastErrors.logToConsole);
    });

    it('should throw an error when the password is not provided', sinon.test(function() {
      expect(fixture.comparePassword.bind(fixture, undefined, 'salt-value', 'hashedPassword-value')).to.throw();
      expect(fixture.comparePassword.bind(fixture, 'password-value', undefined, 'hashedPassword-value')).to.throw();
      expect(fixture.comparePassword.bind(fixture, 'password-value', 'salt-value', undefined)).to.throw();
    }));
  });
});
