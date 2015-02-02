var NOOT = require('../../../../')();

var Field = require('./lib/field');


var ArrayField = Field.extend({
  type: 'array',

  validate: function(value) {
    if (this.required && NOOT.isNone(value)) return false;
    return NOOT.isArray(value);
  }

});

module.exports = ArrayField;