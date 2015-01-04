/**
 * Dependencies
 */
var NOOT = require('../../')('namespace');

/***********************************************************************************************************************
 * @class Time
 * @static
 * @namespace NOOT
 **********************************************************************************************************************/
var Time = NOOT.Namespace.create({});

/**
 * @property SECOND
 * @final
 * @static
 * @type {number}
 */
Time.SECOND = 1000;

/**
 * @property MINUTE
 * @final
 * @static
 * @type {number}
 */
Time.MINUTE = Time.SECOND * 60;

/**
 * @property HOUR
 * @final
 * @static
 * @type {number}
 */
Time.HOUR = Time.MINUTE * 60;

/**
 * @property DAY
 * @final
 * @static
 * @type {number}
 */
Time.DAY = Time.HOUR * 24;

/**
 * @property WEEK
 * @final
 * @static
 * @type {number}
 */
Time.WEEK = Time.DAY * 7;

/**
 * See See {{#crossLink "NOOT.Time.Measure"}}{{/crossLink}}.
 *
 * @property Measure
 * @type {*}
 * @static
 */
Time.Measure = require('./lib/measure');

/**
 * @exports
 */
module.exports = Time;