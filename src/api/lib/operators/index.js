var NOOT = require('../../../../')('namespace');

var Operator = require('./lib/operator');
var ArrayOperator = require('./lib/array-operator');

var Operators = NOOT.Namespace.create({
  eq: Operator.create(),
  ne: Operator.create(),
  in: ArrayOperator.create(),
  nin: ArrayOperator.create(),
  regex: Operator.create({

    /*

    /\d+/gi
    //toto

     */


    parseFromQueryString: function(value) {
      var isRegExpFormatted = value[0] === '/';
      if (isRegExpFormatted) {
        value = value.replace()
      }
      return new RegExp(value);
    }
  }),
  gt: Operator.create(),
  gte: Operator.create(),
  lt: Operator.create(),
  lte: Operator.create()
});


module.exports = Operators;