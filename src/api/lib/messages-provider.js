var NOOT = require('../../../')('object');

var MessagesProvider = NOOT.Object.extend({

  defaultInternalServerError: function() {
    return 'An unexpected error has occurred, please try again later.';
  },

  missingParameter: function(property) {
    return [
      this.highlight(property),
      'is required.'
    ].join(' ');
  },

  notInEnum: function(property, enumeration, currentValue) {
    return [
      this.highlight(property),
      'should be in:',
      this.highlight(enumeration.join(', ')),
      '- instead got',
      this.highlight(currentValue) + '.'
    ].join(' ');
  },

  badType: function(property, expectedType, currentType) {
    return [
      this.highlight(property),
      'should be a',
      this.highlight(expectedType),
      '- instead go a',
      this.highlight(currentType) + '.'
    ].join(' ');
  },

  forbiddenOperator: function(property, operator) {
    return [
      'Operator',
      this.highlight(operator),
      'is not allowed for property',
      this.highlight(property) + '.'
    ].join(' ');
  },

  forbiddenField: function(property) {
    return [
      'Field',
      this.highlight(property),
      'is not allowed or does not exist.'
    ].join(' ');
  },

  highlight: function(str) {
    return '`' + str + '`';
  }

});


module.exports = MessagesProvider;