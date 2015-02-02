var NOOT = require('../../../../')();

var Field = require('./lib/field');


var ObjectField = Field.extend({

  validate: function(value) {
    if (this.required && NOOT.isNone(value)) return false;
    return NOOT.isPlainObject(value);
  }

});

module.exports = ObjectField;