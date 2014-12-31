/**
 * Dependencies
 */
var K = function() { return this; };
var _ = require('lodash');

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
      dest[prop] = (typeof child[prop] === 'function' && _.isEqual(child[prop].prototype, {})) ?
                   (function (name, fn) {
                     return function () {
                       var tmp = this._super;
                       this._super = ('function' === typeof parent[name]) ? parent[name] : K;
                       var ret = fn.apply(this, arguments);
                       this._super = tmp;
                       return ret;
                     };
                   })(prop, child[prop]) :
                   child[prop];
    }

    for (var parentProp in parent) {
      if (dest[parentProp] === undefined) dest[parentProp] = parent[parentProp];
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