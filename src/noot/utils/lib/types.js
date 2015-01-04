/**
 * Types mapping
 */
var TYPES_MAP = {};

['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error', 'Null', 'Undefined']
  .forEach(function(name) {
    TYPES_MAP[ '[object ' + name + ']' ] = name.toLowerCase();
  });


var Utils = {

  /**
   * Detailed `typeof`, will return a string which can be :
   *
   * - boolean
   * - number
   * - string
   * - function
   * - array
   * - date
   * - regexp
   * - object
   * - error
   * - null
   * - undefined
   *
   * @for NOOT
   * @method typeOf
   * @static
   * @param {*} value
   * @return {String} Detected type of `value`
   */
  typeOf: function(value) {
    // TODO implement NOOT.Object class and instances detection
    return TYPES_MAP[Object.prototype.toString.call(value)] || typeof value;
  },

  /**
   *
   * @for NOOT
   * @method isUndefined
   * @static
   * @param {*} value
   * @return {Boolean}
   */
  isUndefined: function(value) { return this.typeOf(value) === 'undefined'; },

  /**
   *
   * @for NOOT
   * @method isDate
   * @static
   * @param {*} value
   * @return {Boolean}
   */
  isDate: function(value) { return this.typeOf(value) === 'date'; },

  /**
   *
   * @for NOOT
   * @method isError
   * @static
   * @param {*} value
   * @return {Boolean}
   */
  isError: function(value) { return this.typeOf(value) === 'error' || value instanceof Error; },

  /**
   *
   * @for NOOT
   * @method isBoolean
   * @static
   * @param {*} value
   * @return {Boolean}
   */
  isBoolean: function(value) { return this.typeOf(value) === 'boolean'; },

  /**
   *
   * @for NOOT
   * @method isNumber
   * @static
   * @param {*} value
   * @return {Boolean}
   */
  isNumber: function(value) { return this.typeOf(value) === 'number'; },

  /**
   *
   * @for NOOT
   * @method isString
   * @static
   * @param {*} value
   * @return {Boolean}
   */
  isString: function(value) { return this.typeOf(value) === 'string'; },

  /**
   *
   * @for NOOT
   * @method isFunction
   * @static
   * @param {*} value
   * @return {Boolean}
   */
  isFunction: function(value) { return this.typeOf(value) === 'function'; },

  /**
   *
   * @for NOOT
   * @method isArray
   * @static
   * @param {*} value
   * @return {Boolean}
   */
  isArray: function(value) { return this.typeOf(value) === 'array'; },

  /**
   *
   * @for NOOT
   * @method isRegExp
   * @static
   * @param {*} value
   * @return {Boolean}
   */
  isRegExp: function(value) { return this.typeOf(value) === 'regexp'; },

  /**
   *
   * @for NOOT
   * @method isObject
   * @static
   * @param {*} value
   * @return {Boolean}
   */
  isObject: function(value) { return this.typeOf(value) === 'object'; },

  /**
   *
   * @for NOOT
   * @method isNull
   * @static
   * @param {*} value
   * @return {Boolean}
   */
  isNull: function(value) { return this.typeOf(value) === 'null'; },

  /**
   * Detect if `value` is `null` or `undefined`.
   *
   * @for NOOT
   * @method isNone
   * @static
   * @param {*} value
   * @return {Boolean}
   */
  isNone: function(value) { return this.isUndefined(value) || this.isNull(value); },

  /**
   * Detect if `value` is a pure JS object.
   *
   * ```javascript
   * NOOT.isPlainObject(NOOT); // false
   * NOOT.isPLainObject({}); // true
   * ```
   *
   * @for NOOT
   * @method isPlainObject
   * @static
   * @param {*} value
   * @return {Boolean}
   */
  isPlainObject: function(value) { return (this.isObject(value) && this.isUndefined(value.prototype)); },

  /**
   * Returns `true` if `value` is :
   * - an empty string
   * - an empty array
   * - an object with no properties
   *
   * @for NOOT
   * @method isEmpty
   * @static
   * @param {*} value
   * @return {Boolean}
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
  },

  isGetter: function(obj, prop) {
    var desc = Object.getOwnPropertyDescriptor(obj, prop);
    return desc && desc.get;
  },

  isSetter: function(obj, prop) {
    var desc = Object.getOwnPropertyDescriptor(obj, prop);
    return desc && desc.set;
  },

  isGetterOrSetter: function(obj, prop) {
    var desc = Object.getOwnPropertyDescriptor(obj, prop);
    return desc && (desc.get || desc.set);
  }

};

/**
 * @exports
 */
module.exports = Utils;