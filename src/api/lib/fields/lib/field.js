var NOOT = require('../../../../../')('object');
var _ = require('lodash');

/***********************************************************************************************************************
 * Base Field class
 *
 * @class Field
 * @namespace NOOT.API
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
   * List of operators supported by this field.
   *
   * @property supportedOperators
   * @type Array of String
   * @default []
   */
  supportedOperators: [],

  /**
   * Public path to access the field.
   *
   * @property publicPath
   * @type String
   * @default path
   */
  _publicPath: null,
  get publicPath() { return this._publicPath || this.path; },
  set publicPath(value) { this._publicPath = value; },

  /**
   * @constructor
   */
  init: function() {
    NOOT.required(this, 'path');
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
   * Method that needs to return the resource that the field is referencing.
   *
   * @method getReference
   * @return NOOT.API.Resource
   */
  reference: null,

  /**
   * Check if `value` is a valid. You must set `isValue` in order to make the system aware of the field's validity,
   * otherwise the field will be considered as valid in further operations. For convenience, returns `isValid`. Default
   * method returns the value of `isValid` for convenience. You may want to keep this behavior when overriding this
   * method.
   *
   * @method validate
   * @return {Boolean} isValid
   */
  validate: function(value) {
    if (this.isRequired && NOOT.isNone(value)) return false;
    return true;
  },

  validateOperator: function(operator) {
    if (!operator) return true;
    return _.contains(this.supportedOperators, operator);
  }

});

/**
 * @exports
 */
module.exports = Field;
