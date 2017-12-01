var assume = require('assume');
var pruddy = require('./');

describe('pruddy', function () {
  const fixture = new Error('Splode');

  it('is exposed as function', function () {
    assume(pruddy).is.a('function');
  });

  it('returns undefined if noting is passed', function () {
    assume(pruddy()).is.a('undefined');
  });

  it('returns a string when a valid error is given', function () {
    assume(pruddy(fixture)).is.a('string');
  });

  it('provides context about the error', function () {
    const rendered = pruddy(fixture);

    assume(rendered).contains('v');
    assume(rendered).contains(`4. describe('pruddy', function () {`);
    assume(rendered).contains(`5.   const fixture = new Error('Splode');`);
    assume(rendered).contains(`6.`);
    assume(rendered).contains('^');
  });

  describe('shift', function () {
    it('can shift the stacktrace', function () {
      const rendered = pruddy(fixture, {
        shift: 1
      });

      assume(rendered).contains('v');
      assume(rendered).does.not.contains(`4. describe('pruddy', function () {`);
      assume(rendered).does.not.contains(`5.   const fixture = new Error('Splode');`);
      assume(rendered).does.not.contains(`6.`);
      assume(rendered).contains('^');
    });
  });

  describe('read', function () {
    it('can provide a custom document fetcher', function (next) {
      pruddy(fixture, {
        read: function read(data) {
          assume(data).is.a('object');
          assume(data.filename).contains('pruddy-error/test.js');
          assume(data.line).equals(5);
          assume(data.col).equals(19);

          next();
        }
      });
    });

    it('uses the returned file as source for highlight', function () {
      const rendered = pruddy(fixture, {
        read: function read() {
          return [
            'line 1',
            'line 2',
            'line 3',
            'line 4',
            'line 5 with some extra long content for me bois',
            'line 6',
          ].join('\n');
        }
      });

      assume(rendered).contains('v');
      assume(rendered).contains(`4. line 4`);
      assume(rendered).contains(`5. line 5 with some extra long content for me bois`);
      assume(rendered).contains(`6. line 6`);
      assume(rendered).contains('^');
    });
  });
});
