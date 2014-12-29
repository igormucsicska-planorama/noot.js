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
    return Array.isArray(arg) ? arg : Array.prototype.slice.call(arg, 0);
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
   * Convert nested arrays to a single flatten one
   *
   * ```javascript
   * NOOT.toFlatArray([1, 2, 3]); // [1, 2, 3]
   * NOOT.toFlatArray([[1], [2, 3]]); // [1, 2, 3]
   * ```
   *
   * @for NOOT
   * @static
   * @method toFlatArray
   * @return {Array}
   */
  toFlatArray: function() {
    var ret = [];
    var args = Utils.makeArray(arguments);
    args.forEach(function(arg) {
      if (Utils.isArray(arg)) ret = ret.concat(Utils.toFlatArray.apply(Utils, arg));
      else ret.push(arg);
    });
    return ret;
  }

};


/**
 * Attach other libraries
 */
['types', 'case', 'validation'].forEach(function(file) {
  _.extend(Utils, require('./lib/' + file));
});


module.exports = Utils;