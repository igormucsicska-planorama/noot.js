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

  _level: null,
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
    if (this._level <= Logger.levels.TRACE) {
      return this._buildAndSend(arguments, 'trace');
    }
  },

  /**
   * Debug log level
   */
  debug: function() {
    if (this._level <= Logger.levels.DEBUG) {
      return this._buildAndSend(arguments, 'debug');
    }
  },

  /**
   * Info log level
   */
  info: function() {
    if (this._level <= Logger.levels.INFO) {
      return this._buildAndSend(arguments, 'info');
    }
  },

  /**
   * Warn log level
   */
  warn: function() {
    if (this._level <= Logger.levels.WARN) {
      return this._buildAndSend(arguments, 'warn');

    }
  },

  /**
   * Error level log
   */
  error: function() {
    if (this._level <= Logger.levels.ERROR) {
      return this._buildAndSend(arguments, 'error');
    }
  },

  /**
   * Application level log
   */
  announce: function() {
    if (this._level !== Logger.levels.OFF) {
      return this._buildAndSend(arguments, 'announce');
    }
  },

  /**
   * High visibility log
   */
  highlight: function() {
    if (this._level !== Logger.levels.OFF) {
      return this._buildAndSend(arguments, 'highlight');
    }
  },

  /**
   * Format message before logging
   *
   * @param message
   * @param [level]
   * @returns {String}
   */
  formatMessage: function(message) {
    return message;
  },

  /**
   * Transport method(s)
   *
   * @param {String} message
   * @param {String} level
   * @param {Function} callback
   */
  transport: function(message, level, callback) {
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
   * @param level
   */
  setLevel: function(level) {
    if (NOOT.isNone(level) || level === '') throw new Error('Missing logging level');

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

    this._level = level;
  },

  /**
   *
   *
   * @param args
   * @param level
   * @private
   */
  _buildAndSend: function(args, level) {
    var message = Logger._joinMessages(NOOT.makeArray(args));
    message = this.formatMessage(message, level);

    var styles = this._styles[level];
    if (styles) {
      for (var style in styles) {
        if (style === 'color') message = message[styles[style]];
        else message = message[style];
      }
    }

    return this.transport(message, level, this.transportCallback);
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
      announce: { color: 'cyan', bold: true },
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
        switch (NOOT.typeOf(part)) {
          case 'error':
            return part.stack.toString();
          case 'undefined':
          case 'null':
            return NOOT.typeOf(part);
          case 'string':
          case 'number':
          case 'boolean':
            return part.toString();
          default:
            return util.inspect(part, { depth: null });
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
      ret[styleName] = _.pick(ret[styleName], ['color', 'bold', 'underline']);
      _.forIn(ret[styleName], function(value, key) { if (!value) delete ret[styleName][key]; });
    }
    return ret;
  }

});

/**
 * @module
 */
module.exports = Logger;