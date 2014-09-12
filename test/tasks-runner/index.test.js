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

    task.stop();
  });

  it('should start task immediately', function() {
    var hasBeenExecuted = false;
    var task = NOOT.TasksRunner.Task.create({
      job: function() { hasBeenExecuted = true; },
      cronPattern: '0 * * * * *',
      startNow: true
    });

    tasksRunner.registerTask(task);
    tasksRunner._tasks.length.should.equal(1);
    hasBeenExecuted.should.equal(true);

    task.stop();
  });

  it('should have ran task', function(done) {
    var hasBeenExecuted = false;
    var task = NOOT.TasksRunner.Task.create({
      job: function() { hasBeenExecuted = true; },
      cronPattern: '* * * * * *'
    });

    tasksRunner.registerTask(task);
    tasksRunner._tasks.length.should.equal(1);

    hasBeenExecuted.should.equal(false);

    setTimeout(function() {
      hasBeenExecuted.should.equal(true);
      task.stop();
      return done();
    }, NOOT.Time.SECOND);
  });

  it('should stop task and remove it from list', function(done) {
    var hasBeenExecuted = false;
    var task = NOOT.TasksRunner.Task.create({
      job: function() { hasBeenExecuted = true; },
      cronPattern: '* * * * * *'
    });

    tasksRunner.registerTask(task);
    tasksRunner._tasks.length.should.equal(1);
    hasBeenExecuted.should.equal(false);

    task.stop();

    setTimeout(function() {
      tasksRunner._tasks.length.should.equal(0);
      hasBeenExecuted.should.equal(false);
      return done();
    }, NOOT.Time.SECOND);
  });

  it('should emit on error', function(done) {
    var err = new Error('Bad things happened');

    var task = NOOT.TasksRunner.Task.create({
      job: function() { throw err; },
      cronPattern: '* * * * * *'
    });

    task.on('error', function(caught) {
      caught.should.equal(err);
      task.stop();
      return done();
    });

    tasksRunner.registerTask(task);
  });

  it('should emit on start', function(done) {
    var task = NOOT.TasksRunner.Task.create({
      job: function() {},
      cronPattern: '0 * * * * *',
      startNow: true
    });

    task.on('start', function() {
      task.stop();
      return done();
    });

    tasksRunner.registerTask(task);
  });

  it('should emit on tick', function(done) {
    var task = NOOT.TasksRunner.Task.create({
      job: function(callback) { return callback(null, true); },
      cronPattern: '0 * * * * *',
      startNow: true
    });

    task.on('done', function(result) {
      result.should.equal(true);
      task.stop();
      return done();
    });

    tasksRunner.registerTask(task);
  });

});