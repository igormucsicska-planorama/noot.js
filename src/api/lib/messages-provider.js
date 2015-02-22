/**
 * Dependencies
 */
var NOOT = require('../../../')('object');

/***********************************************************************************************************************
 * @class MessagesProvider
 * @extends NOOT.Object
 * @namespace NOOT.API
 * @constructor
 **********************************************************************************************************************/
var MessagesProvider = NOOT.Object.extend({

  /**
   * Function to be used for generating a default message for internal server errors. Use it in your error handler.
   *
   * @method defaultInternalServerError
   * @return {String}
   */
  defaultInternalServerError: function() {
    return 'An unexpected error has occurred, please try again later.';
  },

  /**
   * Parameter is missing.
   *
   * @method missingParameter
   * @param {String} property
   * @return {String}
   */
  missingParameter: function(property) {
    return [
      this.highlight(property),
      'is required.'
    ].join(' ');
  },

  /**
   * Value is not in enum.
   *
   * @method notInEnum
   * @param {String} property
   * @param {Array} enumeration
   * @param {*} currentValue
   * @return {String}
   */
  notInEnum: function(property, enumeration, currentValue) {
    return [
      this.highlight(property),
      'should be in:',
      this.highlight(enumeration.join(', ')),
      '- instead got',
      this.highlight(currentValue) + '.'
    ].join(' ');
  },

  /**
   * Value has wrong type.
   *
   * @method badType
   * @param {String} property
   * @param {String} expectedType
   * @param {String} currentType
   * @return {String}
   */
  badType: function(property, expectedType, currentType) {
    return [
      this.highlight(property),
      'should be a',
      this.highlight(expectedType),
      '- instead go a',
      this.highlight(currentType) + '.'
    ].join(' ');
  },

  /**
   * Operator is not allowed.
   *
   * @method forbiddenOperator
   * @param {String} property
   * @param {String} operator
   * @return {String}
   */
  forbiddenOperator: function(property, operator) {
    return [
      'Operator',
      this.highlight(operator),
      'is not allowed for property',
      this.highlight(property) + '.'
    ].join(' ');
  },

  /**
   * Operator is not supported.
   *
   * @method unsupportedOperator
   * @param {String} operator
   * @return {String}
   */
  unsupportedOperator: function(operator) {
    return [
      'Operator',
      operator,
      'is not supported.'
    ].join(' ');
  },

  /**
   * Field is not allowed.
   *
   * @method forbiddenField
   * @param {String} property
   * @param {String} [verb] Verb to be used for building the message
   * @return {String}
   */
  forbiddenField: function(property, verb) {
    return verb ? [
      'Cannot',
      verb,
      'field',
      this.highlight(property) + '.'
    ].join(' ') : [
      'Field',
      this.highlight(property),
      'is not allowed or does not exist.'
    ].join(' ');
  },

  /**
   * Response type is not supported.
   *
   * @method unsupportedResponseType
   * @param {String} type
   * @return {String}
   */
  unsupportedResponseType: function(type) {
    return [
      'Response type',
      this.highlight(type),
      'is not supported.'
    ].join(' ');
  },

  /**
   * Util method to highlight fields names in messages.
   *
   * @method highlight
   * @param {String} str
   * @return {String}
   */
  highlight: function(str) {
    return '`' + str + '`';
  }

});

/**
 * @exports
 */
module.exports = MessagesProvider;