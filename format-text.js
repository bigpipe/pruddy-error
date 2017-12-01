
/**
 * Format the text according to the template.
 *
 * @param {String} text Template that needs to be formatted.
 * @param {Arguments..} .. The arguments that need to be applied.
 * @returns {String} The replaced text.
 */
function format(text) {
  var context;

  if (typeof arguments[1] == 'object' && arguments[1]) {
    context = arguments[1];
  } else {
    context = Array.prototype.slice.call(arguments, 1);
  }

  return String(text).replace(/\{?\{([^{}]+)}}?/g, replace(context));
};

/**
 * Replaces the placeholders with the actual data.
 *
 * @param {object} context data for the template
 * @returns {String} The new template data
 * @private
 */
function replace(context){
  return function replacer(tag, name) {
    if (tag.substring(0, 2) == '{{' && tag.substring(tag.length - 2) == '}}') {
      return '{' + name + '}';
    }

    if (!context.hasOwnProperty(name)) {
      return tag;
    }

    if (typeof context[name] == 'function') {
      return context[name]();
    }

    return context[name];
  }
}

//
// Expose the actual module.
//
module.exports = format;
