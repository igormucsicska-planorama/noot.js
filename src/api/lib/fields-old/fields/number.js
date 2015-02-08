var NOOT = require('../../../../../index')();

var Field = require('./../lib/field');


var NumberField = Field.extend({
  supportedOperators: ['gt', 'gte', 'lt', 'lte', 'in', 'nin', 'ne'],

  parseFromQueryString: function() {
    return parseFloat(this.value);
  },

  validate: function() {
    if (!this._super()) return this.isValid;
    if (!NOOT.isNumber(this.value)) return this.setValid(false, this.badTypeMessage('number'));
    return this.isValid;
  }
});

module.exports = NumberField;