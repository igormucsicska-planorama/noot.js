/**
 * Dependencies
 */
var path = require('path');
var _ = require('lodash');
var NOOT = require('../../')('object');

/***********************************************************************************************************************
 * Configurator Class
 ***********************************************************************************************************************
 *
 *
 **********************************************************************************************************************/
var Configurator = NOOT.Object.extend({
  directory: null,
  env: null,

  /**
   * @constructor
   */
  init: function() {
    if (!this.env) throw new Error('No environment defined for NOOT.Configurator');
    this.directory = this.directory || Configurator.DEFAULTS.DIRECTORY;
  },

  /**
   * Get a configuration or configuration field
   *
   * @param {String} fileName
   * @param {...String} [fields]
   * @returns {*}
   */
  get: function() {
    var args = NOOT.makeArray(arguments);
    var ret = this._load(args.pop());
    args.forEach(function(arg) {
      ret = ret[arg];
    });
    return ret;
  },

  /**
   * Retrieve the configuration
   *
   * @param {String} fileName
   */
  _load: function(fileName) {
    var config;
    try {
      config = require(path.join(this.directory, fileName));
    } catch (e) {
      throw new Error('Could not load configuration : ' + fileName);
    }
    return this._merge(config.all || {}, config[this.env] || {});
  },

  /**
   *
   *
   * @param {Object} left
   * @param {Object} right
   * @returns {Object}
   * @private
   */
  _merge: function(left, right) {
    var ret = {};
    for (var key in right) {
      var leftValue = left[key];
      var rightValue = right[key];

      switch (NOOT.typeOf(leftValue)) {
        case 'object':
          if (NOOT.typeOf(rightValue) === 'object') ret[key] = this._merge(leftValue, rightValue);
          break;
        case 'array':
          if (NOOT.typeOf(rightValue) === 'array') ret[key] = _.union(leftValue, rightValue);
          break;
        default:
          ret[key] = rightValue;
      }

      if (NOOT.isNone(ret[key])) ret[key] = rightValue;
    }

    return ret;
  }

}, {
  DEFAULTS: { DIRECTORY: path.join(process.cwd(), 'config') }
});

/**
 * @exports
 */
module.exports = Configurator;
