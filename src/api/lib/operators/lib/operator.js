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


  parseFromQueryString: function(value, parser, callback) {
    return callback(null, parser(value));
  }

});


/**
 * @exports
 */
module.exports = Operator;