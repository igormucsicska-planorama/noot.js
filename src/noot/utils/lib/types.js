/**
 * Types mapping
 */
var TYPES_MAP = {};

['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error', 'Null', 'Undefined']
  .forEach(function(name) {
    TYPES_MAP[ '[object ' + name + ']' ] = name.toLowerCase();
  });


/***********************************************************************************************************************
 * NOOT.Utils
 ***********************************************************************************************************************
 *
 * @description `type` related utils
 *
 **********************************************************************************************************************/
var Utils = {

  /**
   *
   *
   * @param {*} value
   * @returns {String}
   */
  typeOf: function(value) {
    // TODO implement NOOT.Object class and instances detection
    return TYPES_MAP[Object.prototype.toString.call(value)] || typeof value;
  },

  /**
   *
   *
   * @param {*} value
   * @returns {Boolean}
   */
  isUndefined: function(value) { return this.typeOf(value) === 'undefined'; },

  /**
   *
   *
   * @param {*} value
   * @returns {Boolean}
   */
  isDate: function(value) { return this.typeOf(value) === 'date'; },

  /**
   *
   *
   * @param {*} value
   * @returns {Boolean}
   */
  isError: function(value) { return this.typeOf(value) === 'error'; },

  /**
   *
   *
   * @param {*} value
   * @returns {Boolean}
   */
  isBoolean: function(value) { return this.typeOf(value) === 'boolean'; },

  /**
   *
   *
   * @param {*} value
   * @returns {Boolean}
   */
  isNumber: function(value) { return this.typeOf(value) === 'number'; },

  /**
   *
   *
   * @param {*} value
   * @returns {Boolean}
   */
  isString: function(value) { return this.typeOf(value) === 'string'; },

  /**
   *
   *
   * @param {*} value
   * @returns {Boolean}
   */
  isFunction: function(value) { return this.typeOf(value) === 'function'; },

  /**
   *
   *
   * @param {*} value
   * @returns {Boolean}
   */
  isArray: function(value) { return this.typeOf(value) === 'array'; },

  /**
   *
   *
   * @param {*} value
   * @returns {Boolean}
   */
  isRegExp: function(value) { return this.typeOf(value) === 'regexp'; },

  /**
   *
   *
   * @param {*} value
   * @returns {Boolean}
   */
  isObject: function(value) { return this.typeOf(value) === 'object'; },

  /**
   *
   *
   * @param {*} value
   * @returns {Boolean}
   */
  isNull: function(value) { return this.typeOf(value) === 'null'; },

  /**
   *
   *
   * @param {*} value
   * @returns {Boolean}
   */
  isNone: function(value) { return this.isUndefined(value) || this.isNull(value); },

  /**
   *
   *
   * @param {*} value
   * @returns {Boolean}
   */
  isPlainObject: function(value) { return (this.isObject(value) && this.isUndefined(value.prototype)); },

  /**
   *
   *
   * @param {*} value
   * @returns {Boolean}
   */
  isEmpty: function(value) {
    switch (this.typeOf(value)) {
      case 'string':
        return value === '';
      case 'object':
        return Object.keys(value).length === 0;
      case 'array':
        return value.length === 0;
      default:
        return false;
    }
  }

};

/**
 * @module
 */
module.exports = Utils;