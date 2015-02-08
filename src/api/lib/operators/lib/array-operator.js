var Operator = require('./operator');


var ArrayOperator = Operator.extend({

  parseFromQueryString: function(value, parser) {
    return value.map(parser);
  }

});

module.exports = ArrayOperator;