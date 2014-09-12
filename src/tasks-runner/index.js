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

  registerTask: function(task) {
    if (!task instanceof Task) throw new Error('Task must be an instance of TasksRunner.Task');
    this._tasks.push(this._schedule(task));
  },

  _schedule: function(task) {
    var scheduled = new cron.CronJob({
      cronTime: task.cronPattern,
      onTick: task.run.bind(task),
      start: task.startNow,
      timeZone: 'Europe/Paris'
    });
    scheduled.start();
    return scheduled;
  }
}, {
  Task: Task
});


/**
* @module
*/
module.exports = TasksRunner;