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
   * Value to be passed when instanciating the field.
   *
   * @property value
   * @type *
   */
  value: null,

  /**
   * Default value to be applied in case `value` is not provided.
   *
   * @property defaultValue
   * @type *
   */
  defaultValue: null,

  /**
   *
   *
   * @property operator
   * @type String
   */
  operator: null,

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
   * Defines whether of not `value` is a valid one. This property needs to be set when calling `validate()`.
   *
   * @property isValid
   * @type Boolean
   * @default true
   */
  isValid: true,

  /**
   * Defines whether of not `operator` is a valid one.
   *
   * @property isValidOperator
   * @type Boolean
   * @default true
   */
  isValidOperator: true,

  /**
   * Defines whether or not `value` comes from a query string. If true, then constructor will call
   * `parseFromQueryString()` and set `value` accordingly.
   *
   * @property isQS
   * @type Boolean
   * @default false
   */
  isQS: false,

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
  publicPath: null,

  /**
   * Messages to be used by the API. Useful to store error messages when parsing/validating `value`.
   * Caution: prefer using `pushMessage()` instead of directly populating this array.
   *
   * @property messages
   * @type Array of String
   * @default []
   */
  messages: null,

  /**
   * @constructor
   */
  init: function() {
    NOOT.required(this, 'path');
    this.publicPath = this.publicPath || this.path;
    this.messages = [];
    if (this.isQS) this.value = this.parseFromQueryString();
    this.isValidOperator = !this.operator || _.contains(this.supportedOperators, this.operator);
  },

  /**
   * Responsible of transforming `value` into a public compliant value. By default, simply returns `value`.
   *
   * @method toPublic
   * @return {*}
   */
  toPublic: function() {
    return this.value;
  },

  /**
   * Responsible of transforming `value` into an internal compliant value. By default, simply returns `value`.
   *
   * @method toInternal
   * @return {*}
   */
  toInternal: function() {
    return this.value;
  },

  /**
   * Responsible of parsing value from a query string. I.e., cast a string to a number. By default, simply returns
   * `value`.
   *
   * @method parseFromQueryString
   * @return {*}
   */
  parseFromQueryString: function() {
    return this.value;
  },

  /**
   * Method that needs to return the resource that the field is referencing.
   *
   * @method getReference
   * @return NOOT.API.Resource
   */
  getReference: function() {},

  /**
   * Check if `value` is a valid. You must set `isValue` in order to make the system aware of the field's validity,
   * otherwise the field will be considered as valid in further operations. For convenience, returns `isValid`. Default
   * method returns the value of `isValid` for convenience. You may want to keep this behavior when overriding this
   * method.
   *
   * @method validate
   * @return {Boolean} isValid
   */
  validate: function() {
    if (this.isRequired && NOOT.isNone(this.value)) {
      return this.setValid(false, this.missingParameterMessage());
    }
    return this.isValid;
  },

  /**
   * Convenient method for setting `isValid`. This method returns the value of `isValid`. An optional message can be
   * passed as a second argument. This message will be pushed to `messages` if provided.
   *
   * @param {Boolean} value
   * @param {String} [message]
   * @return {Boolean}
   */
  setValid: function(value, message) {
    value = !!value;
    this.isValid = value;
    if (message) this.pushMessage(message);
    return value;
  },

  /**
   * Pushes a new message into the `messages` array. In most cases, you'll use this method in the `validate()` phase.
   *
   * @param {String} message
   */
  pushMessage: function(message) {
    if (!NOOT.isArray(this.messages)) this.messages = [];
    this.messages.push(message);
  },

  /**
   * Shortcut for static method `missingParameterMessage()`.
   *
   * @method missingParameterMessage
   * @return {String}
   */
  missingParameterMessage: function() {
    return this.constructor.missingParameterMessage(this.publicPath);
  },

  /**
   * Shortcut for static method `notInEnumMessage()`.
   *
   * @method notInEnumMessage
   * @param {Array} enumeration
   * @param {*} [currentValue=`value`]
   * @return {String}
   */
  notInEnumMessage: function(enumeration, currentValue) {
    return this.constructor.notInEnumMessage(this.publicPath, enumeration, currentValue || this.value);
  },

  /**
   * Shortcut for static method `badTypeMessage()`.
   *
   * @method badTypeMessage
   * @param {String} expectedType
   * @param {String} [currentType=NOOT.typeOf(`value`)]
   * @return {String}
   */
  badTypeMessage: function(expectedType, currentType) {
    return this.constructor.badTypeMessage(this.publicPath, expectedType, currentType || NOOT.typeOf(this.value));
  }

}, {

  /**
   * Message : parameter is missing.
   *
   * @method missingParameterMessage
   * @static
   * @param {String} property
   * @return {String}
   */
  missingParameterMessage: function(property) {
    return [property, 'is required.'].join(' ');
  },

  /**
   * Message : value is not in provided list of allowed values.
   *
   * @method notInEnumMessage
   * @static
   * @param {String} property
   * @param {Array} enumeration
   * @param {*} currentValue
   * @return {String}
   */
  notInEnumMessage: function(property, enumeration, currentValue) {
    return [property, 'should be in:', enumeration.join(', '), '- instead got', currentValue + '.'].join(' ');
  },

  /**
   * Message : value's type is incorrect.
   *
   * @method badTypeMessage
   * @static
   * @param {String} property
   * @param {String} expectedType
   * @param {String} currentType
   * @return {String}
   */
  badTypeMessage: function(property, expectedType, currentType) {
    return [property, 'should be a', expectedType, '- instead go a', currentType + '.'].join(' ');
  }

});

/**
 * @exports
 */
module.exports = Field;