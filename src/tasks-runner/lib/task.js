/**
 * Dependencies
 */
var NOOT = require('../../../')('object');
var events = require('events');
var Domain = require('domain');
var _ = require('lodash');

/***********************************************************************************************************************
 * @class Task
 * @namespace NOOT.TasksRunner
 * @constructor
 **********************************************************************************************************************/
var Task = NOOT.Object.extend(_.extend({
  job: null,
  cronPattern: null,
  timeZone: null,
  _scheduler: null,
  _cronJob: null,

  /**
   * @constructor
   */
  init: function() {
    if (!this.job) throw new Error('Cannot create a task without a job');
    if (!this.cronPattern) throw new Error('Cannot create a task without a cronPattern');
    events.EventEmitter.call(this);
  },

  /**
   * Run task
   */
  run: function(callback) {
    var self = this;
    var domain = Domain.create();
    domain.on('error', function(err) {
      if (callback) callback(err);
      return self.emit('error', err);
    });
    domain.run(function() {
      self.emit('start', new Date());
      self.job.call(self, function(err, results) {
        if (err) throw err; // Will be handled by domain
        if (callback) callback(null, results);
        return self.emit('done', results);
      });
    });
  },

  stop: function() {
    this._scheduler._stopTask(this);
    this.emit('stop');
  }

}, events.EventEmitter.prototype));


/**
 * @exports
 */
module.exports = Task;