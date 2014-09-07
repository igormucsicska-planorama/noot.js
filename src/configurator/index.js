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
 * @info Lightweight module to deal with environments configurations
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
    var ret = this._load(args.shift());
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
   * Deeply merge 2 objects
   *
   * @param {Object} left
   * @param {Object} right
   * @returns {Object}
   * @private
   */
  _merge: function(left, right) {
    var self = this;
    var ret = {};

    var leftKeys = Object.keys(left);
    var rightKeys = Object.keys(right);

    rightKeys.forEach(function(key) {
      var leftValue = left[key];
      var rightValue = right[key];

      switch (NOOT.typeOf(leftValue)) {
        case 'object':
          if (NOOT.isObject(rightValue)) ret[key] = self._merge(leftValue, rightValue);
          break;
        case 'array':
          if (NOOT.isArray(rightValue)) ret[key] = _.union(leftValue, rightValue);
          break;
        default:
          ret[key] = rightValue;
      }

      if (NOOT.isNone(ret[key])) ret[key] = rightValue;
    });

    _.pull.apply(_, [leftKeys].concat(rightKeys));
    leftKeys.forEach(function(key) { ret[key] = left[key]; });

    return ret;
  }

}, {
  DEFAULTS: { DIRECTORY: path.join(process.cwd(), 'config') }
});

/**
 * @exports
 */
module.exports = Configurator;
