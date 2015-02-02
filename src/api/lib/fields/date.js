var NOOT = require('../../../../')();

var Field = require('./lib/field');


var DateField = Field.extend({
  parseFromQueryString: function() {
    return this.isTimestamp() ? new Date(this.value) : Date.parse(this.value);
  },

  isTimestamp: function() {
    return !!(this.value && /^\d+$/.test(this.value.toString()));
  },

  validate: function() {
    if (!this._super()) return this.isValid;
    if (!NOOT.isDate(this.value)) return this.setValid(false, this.badTypeMessage('date'));
    return this.isValid;
  }
});

module.exports = DateField;