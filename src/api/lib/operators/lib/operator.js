/**
 * Dependencies
 */
var NOOT = require('../../../../../')('object');

/***********************************************************************************************************************
 *
 *
 *
 *
 **********************************************************************************************************************/
var Operator = NOOT.Object.extend({


  parseFromQueryString: function(value, parser) {
    return parser(value);
  }

});


/**
 * @exports
 */
module.exports = Operator;