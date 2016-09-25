// Test dependencies
var rek = require('rekuire');
var chai = require('chai');
var sinon = require('sinon');

var expect = chai.expect;
var assert = chai.assert;

// System Under Test
var fixture = rek('setup-express');

var handleError = function(error) {
  console.log('HANDLE ERROR:');
  console.log(error);

  throw error;
};

describe('setup-express', function() {
  describe('initialize', function() {
    it('should create an express app', done => {
      assert.isDefined(fixture);

      fixture.initialize()
        .then(function(app) {
          expect(app.route).to.not.be.undefined;
          expect(app.use).to.not.be.undefined;

          done();
        })
        .catch(handleError);
    });

    describe('preRoutesInitalization', function() {
      it('should create an express app', done => {
        assert.isDefined(fixture);

        fixture.initialize()
          .then(function(app) {
            expect(app.route).to.not.be.undefined;
            expect(app.use).to.not.be.undefined;

            done();
          })
          .catch(handleError);
      });
    });
  });
});
