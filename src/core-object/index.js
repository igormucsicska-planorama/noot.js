/***********************************************************************************************************************
 * Dependencies
 **********************************************************************************************************************/
var _ = require('lodash');
var K = function() { return this; }; // Empty function

/**
 * Build "_super" implementation
 *
 * @param dest Object to contain the resulting properties
 * @param parent Parent properties
 * @param child Child properties
 */
var buildSuper = function(dest, parent, child) {
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
};

/***********************************************************************************************************************
 * NOOT.Object
 ***********************************************************************************************************************
 *
 * The purpose of this module is to provide a clear object model for OOJS programming. This is a base Class
 * implementation using the factory pattern. An implementation of 'super' inspired by John Resig is also available to
 * make this object model more scalable.
 *
 *
 * All classes should inherit from this base object.
 *
 * - Use 'NOOT.Object.extend({ ... prototype ... });' to create a new class
 * - Use 'NOOT.Object.create({ ... instance members ... });' to create a new instance
 * - Static members can be added as a second argument in 'extend'
 * - If you provide an 'init' method, it will be used as a 'constructor'
 * - Call 'this._super( args.. )' in any method to call the parent's one
 *
 * - Note that the constructor 'init' method is called after instance members have been set
 *
 **********************************************************************************************************************/

var Obj = function () { };

/**
 * extend
 *
 * @param proto
 * @param statics
 * @returns {child}
 */
Obj.extend = function (proto, stat) {
  if (!arguments.length) proto = {};
  stat = stat || {};

  // Constructor
  var child = function () { return this; };
  var prototype = {};

  // 'super' implementation
  buildSuper(prototype, this.prototype, proto);

  // Prototypal inheritance
  var Surrogate = function () { this.constructor = child; };
  Surrogate.prototype = this.prototype;

  // Static properties
  var statics = {};
  buildSuper(statics, this, stat);
  _.extend(child, this, statics);

  child.prototype = new Surrogate();
  for (var key in prototype) {
    child.prototype[key] = prototype[key];
  }

  // Return the newly created class
  return child;
};


/**
 * create
 *
 * @param def
 * @returns {Object.constructor}
 */
Obj.create = function(def) {
  var instance = new this.prototype.constructor();

  // Set instance members
  for (var key in def) {
    instance[key] = def[key];
  }
  // Call 'init' method, it acts as a constructor
  instance.init.call(instance);
  return instance;
};


/**
 * @ignore
 */
module.exports = Obj.extend({ init: K });