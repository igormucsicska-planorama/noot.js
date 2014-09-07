/**
 * Dependencies
 */
require('colors');
var _ = require('lodash');
var util = require('util');
var NOOT = require('../../')('object');


/***********************************************************************************************************************
 * NOOT.Logger
 ***********************************************************************************************************************
 *
 * @description Simple logger to display/write/send nice logs
 *
 * - Hierarchic logging levels, choose what you want to see in your logs
 * - Configurable transport method : simply override 'writeLog' method, default is console logging
 *
 **********************************************************************************************************************/
var Logger = NOOT.Object.extend({
  level: null,
  transportCallback: NOOT.noop,
  shouldStyle: true,

  _styles: null,

  /**
   * Constructor
   */
  init: function() {
    this.setLevel(this.level);
    this.setStyles();
  },

  /**
   * Trace logging level
   */
  trace: function() {
    if (this.level <= Logger.levels.TRACE) {
      return this._buildAndSend(arguments, 'trace');
    }
  },

  /**
   * Debug log level
   */
  debug: function() {
    if (this.level <= Logger.levels.DEBUG) {
      return this._buildAndSend(arguments, 'debug');
    }
  },

  /**
   * Info log level
   */
  info: function() {
    if (this.level <= Logger.levels.INFO) {
      return this._buildAndSend(arguments, 'info');
    }
  },

  /**
   * Warn log level
   */
  warn: function() {
    if (this.level <= Logger.levels.WARN) {
      return this._buildAndSend(arguments, 'warn');

    }
  },

  /**
   * Error level log
   */
  error: function() {
    if (this.level <= Logger.levels.ERROR) {
      return this._buildAndSend(arguments, 'error');
    }
  },

  /**
   * Application level log
   */
  verbose: function() {
    return this._buildAndSend(arguments, 'verbose');
  },

  /**
   * High visibility log
   */
  highlight: function() {
    return this._buildAndSend(arguments, 'highlight');
  },

  /**
   * Format message before logging
   *
   * @param message
   * @returns {String}
   */
  formatMessage: function(message) {
    return message;
  },

  /**
   * Transport method(s)
   *
   * @param message
   * @param callback
   */
  transport: function(message, callback) {
    console.log(message);
    return callback();
  },

  /**
   * Define logging styles
   *
   * @param value
   */
  setStyles: function(value) {
    this._styles = Logger._buildStylesConfig(_.merge({}, Logger.DEFAULTS.styles, value));
  },

  /**
   * Define logging level
   *
   * @param levelName
   */
  setLevel: function(level) {
    if (NOOT.isNone(level) || NOOT.isEmpty(level)) throw new Error('Missing logging level');

    switch (typeof level) {
      case 'string':
        level = Logger.levels[level.toUpperCase()];
        break;
      case 'number':
        level = _.find(Logger.levels, function(val) { return level === val; });
        break;
      default:
        level = null;
    }

    if (NOOT.isNone(level)) throw new Error('Invalid logging level');

    this.level = level;
  },

  /**
   *
   *
   * @param args
   * @param styleName
   * @private
   */
  _buildAndSend: function(args, styleName) {
    var message = Logger._joinMessages(NOOT.makeArray(args));
    message = this.format(message);

    var styles = this._styles[styleName];
    if (styles) {
      for (var style in styles) {
        if (style === 'color') message = message[styles[style]];
        else message = message[style];
      }
    }

    return this.transport(message, this.transportCallback);
  }


}, {

  /**
   * String used to concatenate messages
   */
  JOINER: ' ',

  /**
   * Levels enumeration
   */
  levels: { TRACE: 0, DEBUG: 1, INFO: 2, WARN: 3, ERROR: 4, OFF: 5 },

  /**
   * Default values
   */
  DEFAULTS: {
    styles: {
      trace: 'grey',
      info: 'magenta',
      warn: 'yellow',
      error: 'red',
      verbose: { color: 'cyan', bold: true },
      highlight: 'inverse'
    }
  },

  /**
   * Concatenate arguments into a single valid string
   *
   * @param args
   * @returns {string}
   * @private
   */
  _joinMessages: function(args) {
    return NOOT.makeArray(args)
      .map(function(part) {
        switch (typeof part) {
          case 'function':
          case 'object':
            if (NOOT.isError(part)) return part.stack.toString();
            return util.inspect(part, { depth: null });
          case 'undefined':
            return 'undefined';
          default:
            return part.toString();
        }
      })
      .join(this.JOINER);
  },

  /**
   * Build an object containing all styles properties
   *
   * @param styles
   * @returns {Object}
   * @private
   */
  _buildStylesConfig: function(styles) {
    var ret = {};
    for (var styleName in styles) {
      ret[styleName] = NOOT.isNone(styles[styleName].color) ? { color: styles[styleName] } : styles[styleName];
      ret[styleName] = _.pick(ret[styleName], ['color', 'bold', 'underline', 'invert']);
      _.forIn(ret[styleName], function(value, key) { if (!value) delete ret[styleName][key]; });
    }
    return ret;
  }

});

/**
 * @module
 */
module.exports = Logger;