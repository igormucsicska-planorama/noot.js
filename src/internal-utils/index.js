/**
 * Dependencies
 */
var K = function() { return this; };

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
      dest[prop] = (typeof child[prop] === 'function') ?
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
  }

};


/**
 * @module
 */
module.exports = __Utils;