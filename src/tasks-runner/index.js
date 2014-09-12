/**
 * Dependencies
 */
var NOOT = require('../../')('object');
var Task = require('./lib/task');
var cron = require('cron');


/***********************************************************************************************************************
 * NOOT.TasksRunner
 ***********************************************************************************************************************
 *
 *
 *
 *
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
    var scheduled = this._schedule(task);
    this._tasks.push(scheduled);
    return scheduled;
  },

  /**
   *
   *
   * @param {TasksRunner.Task} task
   * @returns {exports.CronJob}
   * @private
   */
  _schedule: function(task) {
    var scheduled = new cron.CronJob({
      cronTime: task.cronPattern,
      onTick: task.run.bind(task),
      timeZone: task.timeZone
    });
    if (task.startNow) task.run.call(task);
    scheduled.start();
    return scheduled;
  }
});

/**
 * Attach Task class
 */
TasksRunner.Task = Task;


/**
* @module
*/
module.exports = TasksRunner;