var NOOT = require('../../../../../index')();

var Field = require('./../lib/field');


var DateField = Field.extend({
  supportedOperators: ['eq', 'gt', 'gte', 'lt', 'lte'],

  parseFromQueryString: function(value) {
    return this.isTimestamp(value) ? new Date(value) : Date.parse(value);
  },

  isTimestamp: function(value) {
    return !!(value && /^\d+$/.test(value.toString()));
  },

  validate: function(value) {
    if (!this._super(value)) return false;
    if (!NOOT.isDate(value)) return false;
    return true;
  }
});

module.exports = DateField;