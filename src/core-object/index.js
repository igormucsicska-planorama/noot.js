/**
 * Dependencies
 */
var _ = require('lodash');
var InternalUtils = require('../internal-utils');

/**
 * The purpose of this module is to provide a clear object model for OOJS programming. This is a base Class
 * implementation using the factory pattern. An implementation of 'super' inspired by John Resig is also available to
 * make this object model more scalable.
 *
 * ### Create a class
 *
 * ``` javascript
 * var Person = NOOT.Object.extend({
 *   firstName: '',
 *   lastName: '',
 *
 *   init: function() {
 *     if(!this.lastName || !this.firstName) throw new Error('John Doe is a myth');
 *   },
 *
 *   sayHello: function() {
 *     console.log('Hello, my name is', this.getFullName());
 *   },
 *
 *   getFullName: function() {
 *     return this.firstName + ' ' + this.lastName;
 *   }
 * });
 *
 *
 * var person = Person.create({
 *   firstName: 'John',
 *   lastName: 'Doe'
 * });
 *
 * person.sayHello();
 * // Hello, my name is John Doe
 * ```
 *
 * ### Extend a class
 *
 * ``` javascript
 * var Employee = Person.extend({
 *   job: '',
 *
 *   sayHello: function() {
 *     console.log(this._super(), ', I work as a ', this.job);
 *   }
 * });
 *
 *
 * var employee = Employee.create({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   job: 'developer'
 * });
 *
 * employee.sayHello();
 * // Hello, my name is John Doe, I work as a developer
 ```
 *
 * @class Object
 * @constructor
 * @namespace NOOT
 */

var Obj = function () { };

/**
 * Extend
 *
 * @method extend
 * @static
 * @param {Object} [prototype] Instance members
 * @param {Object} [statics] Static members
 * @returns {NOOT.Object} A new class
 */
Obj.extend = function (prototype, statics) {
  if (!arguments.length) prototype = {};
  statics = statics || {};

  // Constructor
  var child = function () { return this; };
  var proto = {};

  // 'super' implementation
  InternalUtils.buildSuper(proto, this.prototype, prototype);

  // Prototypal inheritance
  var Surrogate = function () { this.constructor = child; };
  Surrogate.prototype = this.prototype;

  // Static properties
  var stat = {};
  InternalUtils.buildSuper(stat, this, statics);
  _.extend(child, this, stat);

  child.protos = new Surrogate();
  for (var key in proto) {
    child.prototype[key] = proto[key];
  }

  // Return the newly created class
  return child;
};


/**
 * @method create
 * @static
 * @param {Object} [def]
 * @returns {NOOT.Object} A new instance
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
module.exports = Obj.extend({ init: function() { return this; } });
