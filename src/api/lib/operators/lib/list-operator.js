var Operator = require('./operator');


var ListOperator = Operator.extend({

  parseFromQueryString: function(value, parser, callback) {
    return callback(null, value.split(this.constructor.SPLIT_LIST_REGEXP).map(parser));
  }

}, {

  SPLIT_LIST_REGEXP: /\s*,\s*/

});

module.exports = ListOperator;