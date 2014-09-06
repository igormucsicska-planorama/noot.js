/**
 * Dependencies
 */
require('colors');
var _ = require('lodash');
var util = require('util');
var NOOT = require('../../')('object');


/***********************************************************************************************************************
 * Logger Class
 ***********************************************************************************************************************
 *
 * Simple logger to display/write/send nice logs
 *
 * - Hierarchic logging levels, choose what you want to see in your logs
 * - Configurable transport method : simply override 'writeLog' method, default is console logging
 *
 **********************************************************************************************************************/
var Logger = NOOT.Object.extend({
  level: null,

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

  verbose: function() {
    return this._buildAndSend(arguments, 'verbose');
  },

  highlight: function() {
    return this._buildAndSend(arguments, 'highlight');
  },

  format: function(message) {
    return message;
  },

  setStyles: function(value) {
    this._styles = Logger._buildStylesConfig(_.merge(value || {}, Logger.DEFAULTS.styles));
  },

  /**
   * Define logging level
   *
   * @info parameter "levelName" has to be defined in the "levels" enumeration
   * @info parameter does not have to respect uppercase notation
   *
   * @param levelName
   */
  setLevel: function(level) {
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


  _buildAndSend: function(args, styleName) {
    var message = Logger._joinMessages(NOOT.makeArray(args));
    message = this.format(message);

    console.log(styleName);
    var styles = this.styles[styleName];
    if (styles) {
      for (var style in styles) {
        if (style === 'color') message = message[styles[style]];
        else message = message[style];
      }
    }

    return this.transport(message, this.onTransport);
  },

  onTransport: function() {

  },

  transport: function(message) {
    console.log(message);
  }

}, {

  JOINER: ' ',

  /**
   * Levels enumeration
   */
  levels: { TRACE: 0, DEBUG: 1, INFO: 2, WARN: 3, ERROR: 4, OFF: 5 },

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
    return Array.prototype.slice.call(args, 0)
      .map(function(part) {
        switch (typeof part) {
          case 'function':
          case 'object':
            if (part instanceof Error) return part.stack.toString();
            return util.inspect(part, { depth: null });
          case 'undefined': return 'undefined';
          default: return part.toString();
        }
      })
      .join(this.JOINER);
  },

  /**
   *
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
    }
    console.log(ret);
    return ret;
  }
});

/**
 * @exports
 */
module.exports = Logger;