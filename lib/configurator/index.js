/**
 * Dependencies
 */
var path = require('path');
var _ = require('lodash');
var NOOT = require('../../')('core-object');

/***********************************************************************************************************************
 * Configurator Class
 ***********************************************************************************************************************
 *
 *
 **********************************************************************************************************************/
var Configurator = NOOT.CoreObject.extend({
  directory: null,
  env: null,

  /**
   * Constructor
   */
  init: function() {
    if (!this.env) throw new Error('');
    this.directory = this.directory || path.join(process.cwd(), 'config');
  },

  /**
   * Check includes
   *
   * Browse the config object, if there is an "include" key,
   * replace the value of the key by the loaded configuration.
   *
   * @param {Object} config
   */
  includes: function(config) {
    for (var k in config) {
      if ('object' === typeof config[k]) {
        if (config[k].include) {
          config[k] = this.get(config[k].include);
        } else {
          this.includes(config[k]);
        }
      }
    }
  },

  /**
   * Extend
   *
   * Load the files in the list and extend the configuration
   *
   * @param {String|Array} list
   * @returns {Object} extension
   */
  extend: function(list) {
    var extension = {};
    if (_.isArray(list)) {
      _.each(list, function(cfg) {
        extension = _.merge(extension, this.get(cfg));
      }, this);
    } else {
      extension = this.get(list);
    }
    return extension;
  },

  /**
   * Retrieve the configuration named *name*
   * It looks for a config file with the same name in the directory
   *
   * If reload is true, does not check the cache (e.g. you can force reload
   * in a different environment).
   *
   * @param {String} name
   */
  load: function(name) {
    var config = {};
    try {
      // If name starts with . or .. look for file where we are
      var loaded = /^(\/|\.)/.test(name) ?
                   require(name) :
                   require(path.join(this.directory, name));

      // Check extension
      if (loaded.extend) {
        config = this.extend(loaded.extend);
      }

      // Merge all with env
      config = _(config)
        .merge(loaded.all || {})
        .merge(loaded[this.env] || {})
        .value();

      // Check includes
      this.includes(config);
    } catch (e) {
      throw new Error('Could not load configuration: ' + e.message);
    }
    return config;
  },

  /**
   * Solver used to create the cache key for memoize
   *
   * @param name
   * @returns {string}
   */
  solver: function(name) {
    return this.env + '_' + name;
  },

  /**
   * Get a configuration or configuration field
   *
   * @param name
   * @param [field]
   * @returns {*}
   */
  get: function(name, field) {
    var config = this.load(name);
    return field ? config[field] : config;
  },

  /**
   * Get a configuration or configuration field
   *
   * @param name
   * @param [field]
   * @returns {*}
   */
  reload: function(name, field) {
    var config = this.load(name);
    return field ? config[field] : config;
  },

  /**
   * Reset directory
   *
   * @param dir
   * @returns {*}
   */
  setDirectory: function(dir) {
    this.directory = dir;
  },

  /**
   * Reset environment
   *
   * @param env
   * @returns {*}
   */
  setEnv: function(env) {
    this.env = env;
  }
});

/**
 * @exports
 */
module.exports = Configurator;
