var NOOT = require('../../../../')();

var Field = require('./lib/field');


var NumberField = Field.extend({
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