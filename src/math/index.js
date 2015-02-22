/**
 * Dependencies
 */
var NOOT = require('../../')('namespace');


/***********************************************************************************************************************
 * Math utils.
 *
 * @class Math
 * @extends NOOT.Namespace
 * @static
 * @namespace NOOT
 **********************************************************************************************************************/
var NOOTMath = NOOT.Namespace.create({

  /**
   * Returns a positive number in any case. Negative numbers return 0. 0 returns 0. Positive numbers are returned
   * untouched.
   *
   * @method positive
   * @param {Number} num
   * @return {Number}
   */
  positive: function(num) {
    return Math.max(num || 0, 0);
  }


});


/**
 * @exports
 */
module.exports = NOOTMath;