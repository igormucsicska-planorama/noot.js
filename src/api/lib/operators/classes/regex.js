var NOOT = require('../../../../../')();
var Operator = require('../lib/operator');

var regexOperator = Operator.create({

  REGEX_PARSER: /^\/(.+)\/([igm]*)$/,

  parseFromQueryString: function(value) {
    if (!this.isValid(value)) throw new Error('Not a valid regex');
    var match = value.match(this.REGEX_PARSER);
    return new RegExp(match[1], match[2]);
  },

  isValid: function(value) {
    return NOOT.isString(value) && this.REGEX_PARSER.test(value);
  }

});

module.exports = regexOperator;