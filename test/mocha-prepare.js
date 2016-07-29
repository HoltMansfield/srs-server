// https://www.npmjs.com/package/mocha-prepare

var prepare = require('mocha-prepare');
 
prepare(function (done) {
  // called before loading of test cases 
  process.env.NODE_ENV = 'test';
  done();
}, function (done) {
  // called after all test completes (regardless of errors) 
  done();
});