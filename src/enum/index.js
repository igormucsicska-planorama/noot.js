/**
 * Dependencies
 */
var NOOT = require('../../')('object');
var _ = require('lodash');


/***********************************************************************************************************************
 * @class Enum
 * @namespace NOOT
 * @extends NOOT.Object
 * @constructor
 **********************************************************************************************************************/
var Enum = NOOT.Object.extend({

  /**
   * @property _map
   * @private
   * @type Object
   */
  _map: null,

  /**
   *
   * @readOnly
   * @property values
   * @type Array
   */
  get values() {
    return _.values(_.pick(this, this.keys));
  },

  /**
   *
   * @property keys
   * @readOnly
   * @type Array
   */
  get keys() {
    return Object.keys(this._map);
  },


  /**
   * Constructor
   */
  init: function() {
    this._map = this._map || {};
    if (!NOOT.isPlainObject(this._map)) throw new Error('Invalid definition for Enum:' + this._map);

    for (var key in this._map) {
      if (!this._map.hasOwnProperty(key)) continue;
      this.set(key, this._map[key]);
    }
  },


  /**
   * Set a new key/value in the enumeration.
   *
   * @method set
   * @param {String} key
   * @param {*} value
   * @chainable
   */
  set: function(key, value) {
    if (this.hasOwnProperty(key)) throw new Error('Cannot override ' + key);
    Object.defineProperty(this, key, {
      value: value,
      writable: false,
      enumerable: true
    });
    if (!this.hasKey(key)) this._map[key] = value;
    return this;
  },

  /**
   * Get a value from the enumeration. Defined for consistency.
   *
   * @method get
   * @param {String} key
   * @return {*}
   */
  get: function(key) {
    return this.hasKey(key) ? this[key] : undefined;
  },

  /**
   * Check if parameter key exists in the the enumeration.
   *
   * @method hasKey
   * @param {String} key
   * @return {Boolean}
   */
  hasKey: function(key) {
    return this._map.hasOwnProperty(key);
  },

  /**
   * Get the key corresponding to parameter value.
   *
   * @method getKey
   * @param {*} value
   * @return {String|undefined}
   */
  getKey: function(value) {
    return _.findKey(this._map, function(val) { return val === value; });
  },

  /**
   * Check if parameter value exists in the the enumeration.
   *
   * @method hasValue
   * @param value
   * @return {Boolean}
   */
  hasValue: function(value) {
    return !!(~this.values.indexOf(value));
  }

}, {

  /**
   * Exceptional redefinition of the `create` behavior. Parameter object contains the enumeration's names/values.
   *
   * @method create
   * @static
   * @param map
   * @return {NOOT.Enum}
   */
  create: function(map) {
    return this._super({ _map: map });
  }

});


module.exports = Enum;