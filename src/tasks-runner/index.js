/**
 * Dependencies
 */
var NOOT = require('../../')('object');
var Task = require('./lib/task');
var cron = require('cron');

/***********************************************************************************************************************
 * @class TasksRunner
 * @namespace NOOT
 * @constructor
 **********************************************************************************************************************/
var TasksRunner = NOOT.Object.extend({
  _tasks: [],

  /**
   * Register a new task
   *
   * @param {TasksRunner.Task} task
   */
  registerTask: function(task) {
    if (!task instanceof Task) throw new Error('Task must be an instance of TasksRunner.Task');

    var cronJob = this._buildCronJob(task);
    task._scheduler = this;
    task._cronJob = cronJob;
    this._tasks.push(task);
    cronJob.start();

    if (task.startNow) task.run.call(task);

    return this;
  },

  _stopTask: function(task) {
    var cronJob = task._cronJob;
    this._tasks.splice(this._tasks.indexOf(cronJob), 1);
    cronJob.stop();
  },

  /**
   *
   *
   * @param {TasksRunner.Task} task
   * @returns {exports.CronJob}
   * @private
   */
  _buildCronJob: function(task) {
    return new cron.CronJob({
      cronTime: task.cronPattern,
      onTick: task.run.bind(task),
      timeZone: task.timeZone
    });
  }
});

/**
 * See {{#crossLink "NOOT.TasksRunner.Task"}}{{/crossLink}}.
 *
 * @property Task
 * @static
 * @type {*}
 */
TasksRunner.Task = Task;


/**
* @exports
*/
module.exports = TasksRunner;