// Test dependencies
var rek = require('rekuire');
var chai = require('chai');
var sinon = require('sinon');
var mongoose = require('mongoose');
var boastErrors = require('boast-errors');

var mongoTestSetup = rek('mongo-test-setup');

var expect = chai.expect;
var assert = chai.assert;


// System Under Test
var fixture; // require this after the Model is registered


describe('tweets-api', () => {
  var tweets;

  var createTestTweet = function() {
    var testTweet = {
      tweetBody: 'Trump loses by largest margin in US History'
    };

    return fixture.create(testTweet);
  };

  beforeEach(function (done) {
    tweets = []; // cleanup between tests

    mongoTestSetup.clearDb(mongoose)
                    .then(() => {
                      fixture = rek('tweets-api');

                      return createTestTweet();
                    })
                    .then(testTweetFromDb => {
                      tweets.push(testTweetFromDb);

                      done();
                    });
  });

  it('creates a tweet', function(done) {
    var newTweet = {
      tweetBody: 'Trumps hair applies for sovereign status'
    };

    fixture.create(newTweet)
      .then(tweetFromDb => {
        expect(tweetFromDb).to.be.defined;
        expect(tweetFromDb._id).to.be.defined;
        expect(tweetFromDb.tweetBody).to.be.defined;
        expect(tweetFromDb.tweetBody).to.equal(newTweet.tweetBody);

        done();
      });
  });
});
