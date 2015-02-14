var Field = require('../lib/field');

var BooleanField = Field.extend({
  supportedOperators: ['eq', 'ne'],

  parseFromQueryString: function(value) {
    return value === 'true';
  }

});

module.exports = BooleanField;