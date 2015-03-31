/**
 * Dependencies
 */
var NOOT = require('../../../../../')('object');
var _ = require('lodash');

/***********************************************************************************************************************
 * Base Field class.
 *
 * @class Field
 * @namespace NOOT.API
 * @extends NOOT.Object
 * @constructor
 **********************************************************************************************************************/
var Field = NOOT.Object.extend({

  /**
   * Default value to be applied in case `value` is not provided.
   *
   * @property defaultValue
   * @type *
   */
  defaultValue: null,

  /**
   * Defines whether or not this field is required.
   *
   * @property isRequired
   * @type Boolean
   * @default false
   */
  isRequired: false,

  /**
   * Defines whether or not this field is a reference to another resource.
   *
   * @property isReference
   * @type Boolean
   * @default false
   */
  isReference: false,

  /**
   * Defines whether or not this field references multiple items of another resource.
   *
   * @property isReferenceArray
   * @type Boolean
   * @default false
   */
  isReferenceArray: false,

  /**
   * Internal path to access the field.
   *
   * @property path
   * @type String
   * @required
   */
  path: null,

  /**
   * Getter that needs to return the resource that the field is referencing.
   *
   * @property reference
   * @type NOOT.API.Resource
   */
  reference: null,

  /**
   * List of operators supported by this field.
   *
   * @property supportedOperators
   * @type Array of String
   * @default []
   */
  supportedOperators: null,

  /**
   * Public path to access the field.
   *
   * @property publicPath
   * @type String
   * @default `path` without wildcards
   */
  _publicPath: null,
  get publicPath() {
    return this._publicPath || this.constructor.removeWildcardsFromPath(this.path);
  },
  set publicPath(value) { this._publicPath = value; },

  /**
   * @constructor
   */
  init: function() {
    NOOT.required(this, 'path');
    NOOT.defaults(this, this.constructor.DEFAULTS);
  },

  /**
   * Responsible of transforming `value` into a public compliant value. By default, simply returns `value`.
   *
   * @method toPublic
   * @return {*}
   */
  toPublic: function(value) {
    return value;
  },

  /**
   * Responsible of transforming `value` into an internal compliant value. By default, simply returns `value`.
   *
   * @method toInternal
   * @return {*}
   */
  toInternal: function(value) {
    return value;
  },

  /**
   * Responsible of parsing value from a query string. I.e., cast a string to a number. By default, simply returns
   * `value`.
   *
   * @method parseFromQueryString
   * @return {*}
   */
  parseFromQueryString: function(value) {
    return value;
  },

  /**
   * Check if value is valid. By default, simply checks if the "required" behavior is respected.
   *
   * @method validate
   * @return {Boolean}
   */
  validate: function(value) {
    return !(this.isRequired && NOOT.isNone(value));
  },

  /**
   * Check if operator is valid/supported.
   *
   * @method validateOperator
   * @param {String} operator
   * @return {Boolean}
   */
  validateOperator: function(operator) {
    if (!operator) return true;
    return _.contains(this.supportedOperators, operator);
  }

}, {

  /**
   * Default values for Fields class.
   *
   * @property DEFAULTS
   * @type Object
   * @static
   */
  DEFAULTS: {
    get supportedOperators() { return []; }
  },

  /**
   * @property WILDCARD
   * @type String
   * @static
   */
  WILDCARD: '$',

  /**
   * Append the wildcard with separators to the path
   *
   * @method appendWildcardToPath
   * @param {String} path
   * @return {String}
   */
  appendWildcardToPath: function (path) {
    return [path, '.', this.WILDCARD, '.'].join('');
  },

  /**
   * Remove wildcards from the given path
   *
   * method removeWildcardsFromPath
   * @param {String} path
   * @return {String}
   */
  removeWildcardsFromPath: function (path) {
    return path.replace(new RegExp(NOOT.toRegExpString('.' + this.WILDCARD + '.')), '.');
  },

  /**
   * Remove references coming from flattening (eg. key.0.value) and replace with the wildcard (eg. key.$.value)
   *
   * @method replaceReferenceWithWildcard
   * @param {String} path
   * @return {String}
   */
  replaceReferenceWithWildcard: function (path) {
    return path.replace(/\.\d+\./, '.' + this.WILDCARD + '.');
  }

});

/**
 * @exports
 */
module.exports = Field;
