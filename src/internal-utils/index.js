/**
 * Dependencies
 */
var K = function() { return this; };
var _ = require('lodash');

var TypeUtils = require('../noot/utils/lib/types');

var fnTest = /xyz/.test(function() { xyz; }) ? /\b_super\b/ : /.*/; // jshint ignore:line


/***********************************************************************************************************************
 *
 ***********************************************************************************************************************
 *
 *
 *
 *
 **********************************************************************************************************************/
var __Utils = {

  /**
   * Build "_super" implementation
   *
   * @param {Object} dest Object to contain the resulting properties
   * @param {Object} parent Parent properties
   * @param {Object} child Child properties
   */
  buildSuper: function(dest, parent, child) {
    for (var prop in child) {

      // Getters and setters are simply overriden without calling the getter
      if (TypeUtils.isGetterOrSetter(child, prop)) {
        Object.defineProperty(dest, prop, Object.getOwnPropertyDescriptor(child, prop));
        //console.log(prop, Object.getOwnPropertyDescriptor(dest, prop));
        continue;
      }

      // Functions that are not classes need the `_super` functionality
      if (typeof child[prop] === 'function' && typeof parent[prop] === 'function' && fnTest.test(child[prop])) {
        dest[prop] = (function (name, fn) {
          return function () {
            var tmp = this._super;
            this._super = ('function' === typeof parent[name]) ? parent[name] : K;
            var ret = fn.apply(this, arguments);
            this._super = tmp;
            return ret;
          };
        })(prop, child[prop]);
        continue;
      }

      // Other properties are simply overriden
      dest[prop] = child[prop];

    }

    // Ensure that the destination also contains all parent's props
    for (var parentProp in parent) {
      if (!TypeUtils.isGetterOrSetter(dest, parentProp) && dest[parentProp] === undefined) {
        if (TypeUtils.isGetterOrSetter(parent, parentProp)) {
          Object.defineProperty(dest, parentProp, Object.getOwnPropertyDescriptor(parent, parentProp));
        } else {
          dest[parentProp] = parent[parentProp];
        }
      }
    }
  },

  /**
   * Build concatenated properties
   *
   * @param {Object} instance
   * @param {Object} def
   * @param {Array} properties
   */
  buildConcatenatedProperties: function(instance, def, properties) {
    properties.forEach(function(propertyName) {
      var instanceOwned = instance[propertyName];
      var defOwned = def[propertyName];
      if (instanceOwned) {
        instance[propertyName] = _.toArray(instanceOwned).concat(defOwned);
      } else {
        instance[propertyName] = _.toArray(defOwned);
      }
    });
  }

};


/**
 * @exports
 */
module.exports = __Utils;