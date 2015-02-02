var NOOT = require('../../../../')();

var Field = require('./lib/field');


var FloatField = Field.extend({

  parseFromQueryString: function() {
    return parseFloat(this.value);
  },

  validate: function() {
    if (!this._super()) return this.isValid;
    if (!NOOT.isNumber(this.value)) return this.seValid(false, this.badTypeMessage('float'));
    return this.isValid;
  }

});

module.exports = FloatField;