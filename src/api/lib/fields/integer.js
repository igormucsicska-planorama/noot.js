var NOOT = require('../../../../')();

var Field = require('./lib/field');


var IntegerField = Field.extend({

  parseFromQueryString: function() {
    return parseInt(this.value, 10);
  },

  validate: function() {
    if (!this._super()) return this.isValid;
    if (!NOOT.isNumber(this.value)) return this.setValid(false, this.badTypeMessage('integer'));
    return this.isValid;
  }

});

module.exports = IntegerField;