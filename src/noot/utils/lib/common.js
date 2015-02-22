/**
 * Dependencies
 */
var _ = require('lodash');


var Utils = {

  /**
   * Create an array from an `arguments` instance.
   *
   * ```javascript
   * var myFunction = function() {
   *   var args = NOOT.makeArray(arguments); // `args` is now a JS array instance
   * };
   * ```
   *
   * @for NOOT
   * @static
   * @method makeArray
   * @param {arguments|Array} arg
   * @return {Array}
   */
  makeArray: function(arg) {
    return arg ? Array.prototype.slice.call(arg, 0) : [];
  },


  /**
   * Rename an object's property by copying the value of the old property to the new one and deleting the old.
   *
   * ```javascript
   * var myObj = { one: 'bar', two: 'foo' };
   * NOOT.renameProperty(myObj, 'one', 'first); // { first: 'bar', two: 'foo' }
   * ```
   *
   * @for NOOT
   * @static
   * @method renameProperty
   * @param {Object} obj
   * @param {String} from
   * @param {String} to
   * @return {Object}
   */
  renameProperty: function(obj, from, to) {
    obj[to] = obj[from];
    delete obj[from];
    return obj;
  },

  /**
   * Rename multiple properties. Same as `renameProperty` but this time you can provide a map of
   * properties to be replaced.
   *
   * ```javascript
   * var myObj = { one: 'bar', two: 'foo' };
   * NOOT.renameProperties(myObj, { one: 'first', two: 'second' }); // { first: 'bar', second: 'foo' }
   * ```
   *
   * @for NOOT
   * @static
   * @method renameProperties
   * @param {Object} obj
   * @param {Array} map
   * @return {Object}
   */
  renameProperties: function(obj, map) {
    for (var key in map) {
      this.renameProperty(obj, key, map[key]);
    }
    return obj;
  },

  /**
   * Empty, chainable function that does... nothing.
   *
   * @for NOOT
   * @static
   * @property noop
   * @chainable
   * @type Function
   */
  noop: function() { return this; },

  /**
   * Escape a string to be RegExp compliant.
   *
   * @for NOOT
   * @static
   * @method toRegExpString
   * @param {String} str
   * @return {String}
   */
  toRegExpString: function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  },

  /**
   * Deeply set a value. Nested objects are created if they don't exist.
   *
   * @for NOOT
   * @method trySet
   * @static
   * @param {Object} obj
   * @param {String} path
   * @param {*} value
   */
  trySet: function(obj, path, value) {
    var parts = path.split('.');
    var initial = parts.shift();

    if (!parts.length) {
      obj[initial] = value;
      return;
    }

    var context = obj[initial] || {};
    var valueKey = parts.pop();

    var str = initial;

    for (var i = 0, len = parts.length; i < len; i++) {
      str += '.' + parts[i];
      if (_.isObject(context)) {
        context[parts[i]] = this.tryGet(obj, str) || {};
        context = context[parts[i]];
      } else if (_.isUndefined(context)) {
        context[parts[i]] = {};
        context = context[parts[i]];
      } else {
        break;
      }
    }

    context[valueKey] = value;

    obj[initial] = context;
  },

  /**
   * Deeply get a value.
   *
   * @for NOOT
   * @method tryGet
   * @static
   * @param {Object} obj
   * @param {String} path
   * @return {*}
   */
  tryGet: function(obj, path) {
    var parts = path.split('.');
    var ret = obj[parts.shift()];

    for (var i = 0, len = parts.length; i < len; i++) {
      if (_.isObject(ret)) {
        ret = ret[parts[i]];
      } else {
        ret = undefined;
        break;
      }
    }

    return ret;
  },

  /**
   * Pick properties
   *
   * @for NOOT
   * @static
   * @method pickProperties
   * @param {Object} obj
   * @param {Array} fields
   * @return {Object}
   */
  pickProperties: function(obj, fields) {
    var ret = {};

    fields.forEach(function(field) {
      var value = Utils.tryGet(obj, field);
      if (!_.isUndefined(value)) Utils.trySet(ret, field, value);
    });

    return ret;
  },

  /**
   * Makes `prop` a read only property. If no value is provided, the current value of `prop` will be used.
   *
   * @for NOOT
   * @static
   * @method makeReadOnly
   * @param {Object} obj
   * @param {String} prop
   * @param {*} [value]
   */
  makeReadOnly: function(obj, prop, value) {
    if (arguments.length < 3) value = this.tryGet(obj, prop);
    return Object.defineProperty(obj, prop, { value: value, writable: false });
  },

  /**
   * Check if date is valid.
   *
   * @for NOOT
   * @static
   * @method isValidDate
   * @param {Date} value
   * @return {Boolean}
   */
  isValidDate: function(value) {
    return _.isDate(value) && !isNaN(+value);
  }

};

module.exports = Utils;