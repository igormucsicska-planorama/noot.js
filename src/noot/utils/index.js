/**
 * Dependencies
 */
var _ = require('lodash');

var Utils = {

  /**
   *
   *
   * @param {arguments|Array} arg
   * @returns {Array}
   */
  makeArray: function(arg) {
    return Array.isArray(arg) ? arg : Array.prototype.slice.call(arg, 0);
  },


  /**
   * Rename an object's property
   *
   * @param {Object} obj
   * @param {String} from
   * @param {String} to
   * @returns {Object}
   */
  renameProperty: function(obj, from, to) {
    obj[to] = obj[from];
    delete obj[from];
    return obj;
  },

  /**
   * Rename multiple properties
   *
   * @param {Object} obj
   * @param {Array} map
   * @returns {Object}
   */
  renameProperties: function(obj, map) {
    for (var key in map) {
      this.renameProperty(obj, key, map[key]);
    }
    return obj;
  },

  noop: function() {}

};


/**
 * Attach other libraries
 */
['types'].forEach(function(file) {
  _.extend(Utils, require('./lib/' + file));
});


/**
 * @module
 */
module.exports = Utils;