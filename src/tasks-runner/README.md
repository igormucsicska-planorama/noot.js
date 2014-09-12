# NOOT.TasksRunner

Simple tasks manager to deal with scheduled jobs.

## Usage
```javascript
var NOOT = require('noot')('tasks-runner');
var Task = NOOT.TasksRunner.Task;

var myTask = Task.create({
    job: function(done) {
        return doSomeAsyncStuff(done);
    },
    cronPattern: '0 * * * * *' // cron pattern : every minute
});

myTask.on('error', function(err) {
    // Treat error
});

myTask.on('done', function(results) {
    // Use or display results
});

myTask.on('start', function() {
    // Will be fired each time the task is launched
});

var tasksRunner = TasksRunner.create();
tasksRunner.registerTask(myTask);
```


## Documentation
##### TasksRunner *class*

- **registerTask** *function(task)*

	Register a new task to be scheduled. `task` has to be an instance of `TasksRunner.Task`.

##### TasksRunner.Task *class*

**Info**

Inherits from build-in events.EventEmitter (http://nodejs.org/api/events.html). Actually fires three events :

- *start* Job has just been launched.
- *error* Fired for any error, including the one that is passed to `done` as well as uncaught errors (they are catched by a `domain`). The error is passed to the callback.
- *done* Fired when job has completed. Job's results are passed to the callback.


**Properties**

- **job** *function(done)* [required]

	Task's job to be executed at each cron tick. `done` is automatically passed and has to be called when the job is completed.

- **cronTime** *string* [required]

	Valid cron pattern (see https://www.npmjs.org/package/cron).

- **startNow** *boolean*

    If `true`, job is immediatly launched after the task has been registered.