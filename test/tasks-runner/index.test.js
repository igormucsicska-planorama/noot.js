var NOOT = nootrequire('tasks-runner', 'time');

describe('NOOT.TasksRunner', function() {
  var tasksRunner = NOOT.TasksRunner.create();

  it('should create an instance', function() {
    tasksRunner.should.be.an('object');
  });
  it('should register a task', function() {
    var task = NOOT.TasksRunner.Task.create({
      job: function() {},
      cronPattern: '0 * * * * *'
    });

    tasksRunner.registerTask(task);
    tasksRunner._tasks.length.should.equal(1);
  });
  it('should start task immediately', function() {
    var hasBeenExecuted = false;
    var task = NOOT.TasksRunner.Task.create({
      job: function() { hasBeenExecuted = true; },
      cronPattern: '0 * * * * *',
      startNow: true
    });

    tasksRunner.registerTask(task);
    tasksRunner._tasks.length.should.equal(2);
    hasBeenExecuted.should.equal(true);
  });
  it('should have ran task', function(done) {
    var hasBeenExecuted = false;
    var task = NOOT.TasksRunner.Task.create({
      job: function() { hasBeenExecuted = true; },
      cronPattern: '* * * * * *'
    });

    tasksRunner.registerTask(task);
    tasksRunner._tasks.length.should.equal(3);

    hasBeenExecuted.should.equal(false);

    setTimeout(function() {
      hasBeenExecuted.should.equal(true);
      return done();
    }, NOOT.Time.SECOND);
  });

});