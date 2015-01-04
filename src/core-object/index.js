/**
 * Dependencies
 */
var _ = require('lodash');
var InternalUtils = require('../internal-utils');
var TypeUtils = require('../noot/utils/lib/types');

/***********************************************************************************************************************
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
 * ```
 *
 * @class Object
 * @constructor
 **********************************************************************************************************************/
var Obj = function () { };

/**
 * Extend
 *
 * @method extend
 * @static
 * @param {Object} [prototype] Instance members
 * @param {Object} [statics] Static members
 */
Obj.extend = function (prototype, statics) {
  if (!arguments.length) prototype = {};
  statics = statics || {};

  // Constructor
  var Class = function () { return this; };
  var proto = {};

  // 'super' implementation
  InternalUtils.buildSuper(proto, this.prototype, prototype);

  // Prototypal inheritance
  var Surrogate = function () { this.constructor = Class; };
  Surrogate.prototype = this.prototype;

  // Static properties
  var stat = {};
  InternalUtils.buildSuper(stat, this, statics);
  _.extend(Class, this, stat);

  Class.prototype = new Surrogate();

  for (var key in proto) {
    if (TypeUtils.isGetterOrSetter(proto, key)) {
      Object.defineProperty(Class.prototype, key, Object.getOwnPropertyDescriptor(proto, key));
    } else {
      Class.prototype[key] = proto[key];
    }
  }

  // Keep a reference
  Class.superClass = this;

  // Return the newly created class
  return Class;
};


/**
 * @method create
 * @static
 * @param {Object} [def]
 */
Obj.create = function(def) {
  if (typeof def !== 'object' && def !== undefined) throw new Error('NOOT.Object.create only accepts objects');

  var instance = new this.prototype.constructor();

  if (def) {
    var keyNames = Object.keys(def);
    var concatenatedProperties = def.concatenatedProperties || instance.concatenatedProperties;

    if (concatenatedProperties) {
      InternalUtils.buildConcatenatedProperties(instance, def, concatenatedProperties);
      keyNames = _.pull.apply(_, [keyNames].concat(concatenatedProperties));
    }

    keyNames.forEach(function(key) {
      instance[key] = def[key];
    });
  }

  if (instance.init) instance.init.call(instance);

  return instance;
};

/**
 * Detect if parameter class is a subclass
 *
 * @method detect
 * @static
 * @param Class Class to be tested
 * @return {boolean}
 */
Obj.detect = function(Class) {
  if ('function' !== typeof Class) return false;
  while (Class) {
    if (Class === this) return true;
    Class = Class.superClass;
  }
  return false;
};

/**
 * @exports
 */
module.exports = Obj.extend({ init: function() { return this; } });
