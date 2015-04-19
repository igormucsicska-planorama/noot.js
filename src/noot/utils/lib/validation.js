var _ = require('lodash');

var ValidationUtils = {

  /**
   * Check if parameter object contains the given properties and the values are not falsy.
   *
   * @for NOOT
   * @method required
   * @static
   * @param {Object} obj Object against which to run the tests
   * @param {String} [str, ...] Properties names
   */
  required: function() {
    var args = Array.prototype.slice.call(arguments, 0);
    var obj = args.shift();
    return args.forEach(function(name) {
      if (!obj[name]) throw new Error('`' + name + '` is mandatory');
    });
  },

  /**
   * Apply default values to parameter object.
   *
   * @for NOOT
   * @method defaults
   * @static
   * @param {Object} obj
   * @param {Object} defaults
   * @param {Boolean} [undefinedOnly=false]
   * @returns {Object} obj The same object reference
   */
  defaults: function(obj, defaults, undefinedOnly) {
    for (var key in defaults) {
      if (undefinedOnly ? typeof obj[key] === undefined : !obj[key]) obj[key] = _.cloneDeep(defaults[key]);
    }
    return obj;
  }

};

/**
 * @exports
 */
module.exports = ValidationUtils;