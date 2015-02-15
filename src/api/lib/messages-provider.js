/**
 * Dependencies
 */
var NOOT = require('../../../')('object');

/***********************************************************************************************************************
 * @class MessagesProvider
 * @extends NOOT.Object
 * @namespace NOOT.API
 **********************************************************************************************************************/
var MessagesProvider = NOOT.Object.extend({

  /**
   *
   *
   * @method defaultInternalServerError
   * @return {String}
   */
  defaultInternalServerError: function() {
    return 'An unexpected error has occurred, please try again later.';
  },

  /**
   *
   *
   * @method missingParameter
   * @return {String}
   */
  missingParameter: function(property) {
    return [
      this.highlight(property),
      'is required.'
    ].join(' ');
  },

  /**
   *
   *
   * @method notInEnum
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
   *
   *
   * @method badType
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
   *
   *
   * @method forbiddenOperator
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
   *
   *
   * @method unsupportedOperator
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
   *
   *
   * @method forbiddenField
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
   *
   *
   * @method unsupportedResponseType
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
   *
   *
   * @method
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