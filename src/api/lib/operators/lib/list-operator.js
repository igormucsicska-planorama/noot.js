var Operator = require('./operator');


var ListOperator = Operator.extend({

  parseFromQueryString: function(value, parser) {
    return value.split(this.constructor.SPLIT_LIST_REGEXP).map(parser);
  }

}, {

  SPLIT_LIST_REGEXP: /\s*,\s*/

});

module.exports = ListOperator;