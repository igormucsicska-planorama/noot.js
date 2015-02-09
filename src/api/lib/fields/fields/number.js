var NOOT = require('../../../../../index')();

var Field = require('./../lib/field');


var NumberField = Field.extend({
  supportedOperators: ['eq', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'ne'],

  parseFromQueryString: function(value) {
    return parseFloat(value);
  },

  validate: function(value) {
    if (!this._super(value)) return false;
    if (!NOOT.isNumber(value)) return false;
    return true;
  }
});

module.exports = NumberField;