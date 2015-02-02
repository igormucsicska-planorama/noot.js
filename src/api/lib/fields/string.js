var NOOT = require('../../../../')();

var Field = require('./lib/field');


var StringField = Field.extend({

  validate: function() {
    if (!this._super()) return this.isValid;
    if (!NOOT.isString(this.value)) return this.setValid(false, this.badTypeMessage('string'));
    return this.isValid;
  }

});

module.exports = StringField;