/**
 * Dependencies
 */
var CoreObject = require('./core-object');
var _ = require('lodash');
_.str = require('underscore.string');


/***********************************************************************************************************************
 * NOOTManager
 ***********************************************************************************************************************
 *
 *
 *
 *
 **********************************************************************************************************************/
var NOOTManager = CoreObject.create({
  _LIB_PATH: './',

  /**
   *
   *
   * @param name
   * @returns {*}
   */
  require: function(name) {
    return require(this._getModulePath(name));
  },

  /**
   *
   *
   * @returns {*}
   * @private
   */
  _buildDependencies: function() {
    var args = this._getArguments(Array.prototype.slice.call(arguments, 0));

    // If no dependency is specified, return the NOOTManager
    if(!args.length) return this;

    // Else build an object containing the required dependencies
    var self = this;
    var dependencies = {};
    _.uniq(args).forEach(function(arg) {
      dependencies[self._getModuleName(arg)] = self.require(arg);
    });

    return dependencies;
  },

  /**
   *
   *
   * @param args
   * @returns {Array}
   * @private
   */
  _getArguments: function(args) {
    var self = this;
    var ret = [];

    args.forEach(function(arg) {
      Array.isArray(arg) ?
      ret = ret.concat(self._getArguments(arg)) :
      ret.push(arg);
    });

    return ret;
  },

  /**
   *
   *
   * @param name
   * @returns {*|XML|string|void}
   * @private
   */
  _dasherizeName: function(name) {
    return _.str.dasherize(name).replace(/^-/, '');
  },

  /**
   *
   *
   * @param name
   * @returns {string}
   * @private
   */
  _getModuleName: function(name) {
    return _.str.classify(this._dasherizeName(name));
  },

  /**
   *
   *
   * @param name
   * @returns {string}
   * @private
   */
  _getModulePath: function(name) {
    return this._LIB_PATH + this._dasherizeName(name);
  }
});

/**
 * @module
 */
module.exports = NOOTManager._buildDependencies.bind(NOOTManager);