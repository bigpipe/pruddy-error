var failingLine = require('./failing-line');
var nodeRequire;
var fs;

//
// wut, yeah, this is for browserify to prevent it from bundling
// a file system polyfill.
//
if (require('is-node')) {
  nodeRequire = require;
  fs = nodeRequire('fs');
  nodeRequire = null;
}

/**
 * Failing code.
 *
 * @param {Error} error Error.
 * @param {Object} options Configuration.
 * @returns {Undefined|Array} Parsed failed code.
 * @private
 */
function failingCode(error, options) {
  var ln = failingLine(error, options.shift);

  if (!ln) return;

  var doc = options.read && options.read(ln);
  if (!doc && fs) {
    try {
      doc = fs.readFileSync(ln.filename).toString();
    } catch (e) {
      return undefined;
    }
  }

  if (!doc) return undefined;

  var lines = typeof doc === 'string' ? doc.split('\n') : doc;
  var result = [];

  var i = ln.line - 3;
  while (++i < ln.line + 1) {
    if (i + 1 != ln.line) {
      result.push({
        line: ln.line - (ln.line - i -1),
        code: lines[i]
      });

      continue;
    }

    result.push({
      line: ln.line,
      col: ln.col,
      fn: ln.fn,
      filename: ln.filename,
      code: lines[i],
      failed: true
    });
  }

  return result;
}

//
// Expose the module.
//
module.exports = failingCode;
