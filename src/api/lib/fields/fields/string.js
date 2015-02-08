var NOOT = require('../../../../../index')();

var Field = require('./../lib/field');

var StringField = Field.extend({
  supportedOperators: ['gt', 'gte', 'lt', 'lte', 'in', 'nin', 'ne', 'regex'],

  validate: function(value) {
    if (!this._super(value)) return false;
    if (!NOOT.isString(value)) return false;
    return true;
  }

});

module.exports = StringField;