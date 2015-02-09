var Operator = require('./operator');


var ArrayOperator = Operator.extend({

  parseFromQueryString: function(value, parser) {
    return value.split(this.constructor.SPLIT_LIST_REGEXP).map(parser);
  }

}, {

  SPLIT_LIST_REGEXP: /\s*,\s*/

});

module.exports = ArrayOperator;