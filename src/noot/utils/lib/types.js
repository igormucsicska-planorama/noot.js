/**
 * Dependencies
 */
var _str = require('underscore.string');
var _ = require('lodash');


var TYPES_MAP = {};
[
  'Boolean',
  'Number',
  'String',
  'Function',
  'Array',
  'Date',
  'RegExp',
  'Object',
  'Error',
  'Null',
  'Undefined'
].forEach(function(name) {
  TYPES_MAP[ '[object ' + name + ']' ] = name.toLowerCase();
});


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
   * @param value
   * @returns {Boolean}
   */
  isNone: function(value) { return this.isUndefined(value) || this.isNull(value); }
};

/**
 *
 */
_.forIn(TYPES_MAP, function(str, type) {
  Utils['is' + _str.classify(type)] = function(value) { return this.typeOf(value) === type; }.bind(Utils);
});

/**
 * @module
 */
module.exports = Utils;