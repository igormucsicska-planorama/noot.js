/**
 * Dependencies
 */
var _ = require('lodash');
var changeCase = require('change-case');
var Utils = require('./utils');
var NOOT = {
  Namespace: require('../namespace')
};


var DependenciesManager = NOOT.Namespace.create({
  IRREGULAR_PROPERTY_NAMES: [
    { reg: /^rest$/i, name: 'REST' }
  ],

  /**
   *
   *
   * @returns {Object}
   */
  require: function() {
    var ret = {};
    var args = this._getArguments.apply(this, arguments).map(this._resolve.bind(this));

    args.forEach(function(resolved) {
      ret = _.merge(ret, resolved);
    });

    return ret;
  },

  /**
   *
   *
   * @param moduleName
   * @returns {Object}
   * @private
   */
  _require: function(moduleName) {
    return require('../' + moduleName);
  },

  /**
   *
   *
   * @param name
   * @returns {Object}
   * @private
   */
  _resolve: function(name) {
    var mainOnly = name.split('/')[0].split('.')[0];
    var ret = {};
    ret[this._resolvePropertyName(mainOnly)] = this._require(changeCase.param(mainOnly));
    return ret;
  },

  /**
   *
   *
   * @param name
   * @returns {String}
   * @private
   */
  _resolvePropertyName: function(name) {
    return this._resolveIrregularPropertyName(name) || changeCase.pascal(name);
  },

  /**
   *
   *
   * @param name
   * @returns {String}
   * @private
   */
  _resolveIrregularPropertyName: function(name) {
    for (var i = 0; i < this.IRREGULAR_PROPERTY_NAMES.length; i++) {
      var item = this.IRREGULAR_PROPERTY_NAMES[i];
      if (item.reg.test(name)) return item.name;
    }
    return null;
  },

  /**
   *
   *
   * @returns {Array}
   * @private
   */
  _getArguments: function() {
    var self = this;
    var ret = [];
    var args = Utils.makeArray(arguments);

    args.forEach(function(arg) {
      if (!Array.isArray(arg)) ret.push(arg);
      else ret = ret.concat(self._getArguments.apply(self, arg));
    });

    return ret;
  }
});

/**
 * @module
 */
module.exports = DependenciesManager;
