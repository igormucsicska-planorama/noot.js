var NOOT = require('../../../../')();

var Field = require('./lib/field');


var BooleanField = Field.extend({
  type: 'boolean',

  format: function(value) {
    return value === 'true' ? true : value === 'false' ? false : value;
  },

  validate: function(value) {
    if (this.required && NOOT.isNone(value)) return false;
    return NOOT.isBoolean(value);
  }

});

module.exports = BooleanField;