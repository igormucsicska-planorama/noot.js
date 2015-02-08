var NOOT = require('../../../../../index')();

var Field = require('./../lib/field');

var StringField = Field.extend({
  supportedOperators: ['gt', 'gte', 'lt', 'lte', 'in', 'nin', 'ne', 'regex'],

  validate: function() {
    if (!this._super()) return this.isValid;
    if (!NOOT.isString(this.value)) return this.setValid(false, this.badTypeMessage('string'));
    return this.isValid;
  }

});

module.exports = StringField;