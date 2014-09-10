/**
 * Dependencies
 */
var NOOT = require('../../../')('object');

/***********************************************************************************************************************
 * NOOT.Time.Measure
 ***********************************************************************************************************************
 *
 *
 *
 *
 **********************************************************************************************************************/
var Measure = NOOT.Object.extend({
  _isStarted: false,
  _startHrTime: null,
  _elapsed: 0,

  /**
   * Start measure
   *
   * @returns {Array}
   */
  start: function() {
    this._isStarted = true;
    this._startHrTime = process.hrtime();
    return this._startHrTime;
  },

  /**
   * Start measure
   *
   * @returns {Array}
   */
  stop: function() {
    var elapsedHrTime = process.hrtime(this._startHrTime); // We need precision, call this ASAP !
    if (!this._isStarted) throw new Error('Cannot stop measure before starting it');
    this._elapsed = elapsedHrTime[0] * 1e9 + elapsedHrTime[1];
    return elapsedHrTime;
  },

  /**
   * Get mesured time in nanoseconds
   *
   * @returns {Number}
   */
  getNanoSeconds: function() {
    return this._elapsed;
  },

  /**
   * Get mesured time in microseconds
   *
   * @param {Boolean} shouldRound
   * @returns {Number}
   */
  getMicroSeconds: function(shouldRound) {
    return this._toPrecision(1e3, shouldRound);
  },

  /**
   * Get mesured time in milliseconds
   *
   * @param {Boolean} shouldRound
   * @returns {Number}
   */
  getMilliSeconds: function(shouldRound) {
    return this._toPrecision(1e6, shouldRound);
  },

  /**
   * Get mesured time in seconds
   *
   * @param {Boolean} shouldRound
   * @returns {Number}
   */
  getSeconds: function(shouldRound) {
    return this._toPrecision(1e9, shouldRound);
  },

  /**
   * Convert to precision using given factor - Also rounds the returned value if asked for
   *
   * @param {Number} factor
   * @param {Boolean} shouldRound
   * @returns {Number}
   * @private
   */
  _toPrecision: function(factor, shouldRound) {
    var value = this._elapsed / factor;
    return shouldRound ? Math.round(value) : value;
  }

});

/**
 * @module
 */
module.exports = Measure;