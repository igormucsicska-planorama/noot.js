/**
 * Dependencies
 */
var NOOT = require('../../../')('object');
var events = require('events');
var Domain = require('domain');
var _ = require('lodash');


/***********************************************************************************************************************
 * NOOT.TasksRunner.Task
 ***********************************************************************************************************************
 *
 *
 *
 *
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
  run: function() {
    var self = this;
    var domain = Domain.create();
    domain.on('error', function(err) {
      return self.emit('error', err);
    });
    domain.run(function() {
      self.emit('start', new Date());
      self.job.call(self, function(err) {
        if (err) throw err; // Will be handled by domain
        return self.emit.apply(self, ['done'].concat(NOOT.makeArray(arguments).slice(1)));
      });
    });
  },

  stop: function() {
    this._scheduler._stopTask(this);
    this.emit('stop');
  }

}, events.EventEmitter.prototype));


/**
 * @module
 */
module.exports = Task;