/**
 * Dependencies
 */
require('colors');
var _ = require('lodash');
var util = require('util');
var NOOT = nootrequire('core-object');

/**
 * Default values for styling
 */
var DEFAULT_STYLES = {
  ALWAYS: { color: 'cyan', bold: true, underline: true },
  ERROR: 'red',
  WARN: 'yellow',
  INFO: 'magenta',
  TRACE: 'grey'
};

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
var Logger = NOOT.CoreObject.extend({
  level: null,

  /**
   * Constructor
   */
  init: function() {
    this.setLevel(this.level);
    this.styles = _.extend(_.cloneDeep(DEFAULT_STYLES), this.styles);
  },

  /**
   * Trace logging level
   */
  trace: function() {
    if (this.level <= Logger.levels.TRACE) {
      this.writeLog(Logger._joinMessages(arguments), Logger.levels.TRACE);
    }
  },

  /**
   * Debug log level
   */
  debug: function() {
    if (this.level <= Logger.levels.DEBUG) {
      this.writeLog(Logger._joinMessages(arguments), Logger.levels.DEBUG);
    }
  },

  /**
   * Info log level
   */
  info: function() {
    if (this.level <= Logger.levels.INFO) {
      this.writeLog(Logger._joinMessages(arguments), Logger.levels.INFO);
    }
  },

  /**
   * Warn log level
   */
  warn: function() {
    if (this.level <= Logger.levels.WARN) {
      this.writeLog(Logger._joinMessages(arguments), Logger.levels.WARN);
    }
  },

  /**
   * Error level log
   *
   * @info if first arg is an Error, stack trace will be logged, else messages will be concatenated
   */
  error: function() {
    if (this.level > Logger.levels.ERROR) return;

    var message = arguments[0] instanceof Error ?
                  arguments[0].stack.toString() :
                  Logger._joinMessages(arguments);

    this.writeLog(message, Logger.levels.ERROR);
  },

  /**
   * Always print a title message without carring logging level
   *
   * @info mainly useful for application logs, i.e. server starting log
   */
  title: function() {
    this.writeLog(Logger._joinMessages(arguments), Logger.levels.ALWAYS);
  },

  /**
   * Write method / default is console
   *
   * @info override me to send your logs elsewhere, i.e. to a file
   *
   * @param message
   * @param level
   */
  writeLog: function(message, level) {
    var date = new Date().toISOString();
    var color;
    var isBold = false;
    var underline = false;

    level = _.findKey(Logger.levels, function(val) { return level === val; });

    color = (level ? this.styles[level] : '') || 'white';

    if (color instanceof Object) {
      color = color.color;
      isBold = color.bold;
      underline = color.underline;
    }

    if (underline) message = message.underline;
    message = [date, message].join(' ')[color];
    if (isBold) message = message.bold;

    return console.log(message);
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

    if (~[null, undefined].indexOf(level)) throw new Error('Invalid logging level');

    this.level = level;
  }
}, {

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
          case 'object': return util.inspect(part, { depth: null });
          case 'undefined': return 'undefined';
          default: return part.toString();
        }
      })
      .join(' ');
  },

  /**
   * Levels enumeration
   */
  levels: { TRACE: 0, DEBUG: 1, INFO: 2, WARN: 3, ERROR: 4, OFF: 5, ALWAYS: 6 }
});

/**
 * @exports
 */
module.exports = Logger;