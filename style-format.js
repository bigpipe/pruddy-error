var ansi = require('./ansi-codes.json');
var format = require('./format-text');

/**
 * Introduce ASCII as template tags.
 *
 * @param {String} text
 * @returns {String} ANSI injected Template
 * @public
 */
function styleFormat(text) {
  return format(text, ansi);
}

//
// Expose the module.
//
module.exports = styleFormat;
