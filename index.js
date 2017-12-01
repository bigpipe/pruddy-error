var failingCode = require('./failing-code');
var style = require('./style-format');
var format = require('./format-text');
var leftpad = require('left-pad');

/**
 * The template that is rendered with the error detailed error information.
 *
 * @type {String}
 * @private
 */
var template = style([
  '{bold}{red}{title} {grey}{filename}{reset}',
  '    {red}{v}',
  '    {grey}{previousLineNo}. {previousLine}',
  '    {reset}{failingLineNo}. {failingLine}',
  '    {grey}{nextLineNo}. {nextLine}',
  '    {red}{^}{reset}',
  '    {stack}',
  '{reset}'
].join('\n'));

/**
 * Replaces the newlines with tabbed newlines.
 *
 * @param {String} Stack error stack that needs to be tabbed
 * @returns {String} Tabbed stacktrace
 * @private
 */
function tabStack(stack) {
  return stack.replace(/\n/g, '\n    ');
}

/**
 * Shows the column
 *
 * @param {Array} code The failing code information.
 * @param {Number} tabn Tabs
 * @param {String} ch Character that needs to be shown.
 * @private
 */
function showColumn(code, tabn, ch) {
  var i = String(code[1].line).length + code[1].col + 1 + tabn;
  var result = '';

  while (i--) {
    result += ' ';
  }

  return result + ch;
}

/**
 * Reformat an error so it shows detailed debug information.
 *
 * @param {Error} error The error that needs to be pretty.
 * @param {Object} options Addition configuration.
 * @returns {Undefined|String} Rendered template or bust.
 * @public
 */
function pruddy(error, options) {
  if (!error || !error.stack) return;

  options = options || {};

  var code = options.code || failingCode(error, options);
  if (!code) return;

  var previous = String(code[0].line);
  var failing = String(code[1].line);
  var next = String(code[2].line);
  var line = Math.max(previous.length, failing.length, next.length);

  return format(template, {
    title: error.message,
    filename: code[1].filename,
    previousLine: code[0].code,
    previousLineNo: leftpad(previous, line),
    previousColNo: code[0].col,
    failingLine: code[1].code,
    failingLineNo: leftpad(failing, line),
    failingColNo: code[1].col,
    nextLine: code[2].code,
    nextLineNo: leftpad(next, line),
    nextColNo: code[2].col,
    stack: tabStack(error.stack),
    '^': showColumn(code, line - failing.length, '^'),
    'v': showColumn(code, line - failing.length, 'v')
  });
}

//
// Expose the module
//
module.exports = pruddy;
