var assume = require('assume');
var pruddy = require('./');

describe('pruddy', function () {
  it('is exposed as function', function () {
    assume(pruddy).is.a('function');
  });

  it('returns undefined if noting is passed', function () {
    assume(pruddy()).is.a('undefined');
  });

  it('returns a string when a valid error is given', function () {
    var error = new Error('Splode');

    assume(pruddy(error)).is.a('string');
  });
});
