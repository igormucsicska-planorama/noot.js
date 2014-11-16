var NOOT = nootrequire('mongoose');
var mongoose = require('mongoose');
var _ = require('lodash');

var Schema = NOOT.Mongoose.Schema;

var TEST_DB_NAME = 'noot-mongoose-middlewares-test';
var TEST_COLLECTION_NAME = 'use_timestamps';


describe('NOOT.Mongoose.useTimestamps()', function() {

  before(function(done) {
    return mongoose.connect('mongodb://localhost:27017/' + TEST_DB_NAME, function() {
      return mongoose.connection.db.collectionNames(function(err, names) {
        if (err) done(err);
        if (_.find(names, { name: TEST_DB_NAME + '.' + TEST_COLLECTION_NAME })) {
          return mongoose.connection.collection(TEST_COLLECTION_NAME).drop(done);
        } else {
          return done();
        }
      });
    });
  });


  it('should contain middleware', function() {
    NOOT.Mongoose.useTimestamps.should.be.a('function');
  });

  it('should add all timings', function(done) {
    var schema = Schema.extend({ modelName: 'UseTimestampsAll', options: { collection: TEST_COLLECTION_NAME } });

    NOOT.Mongoose.useTimestamps(schema);

    mongoose.model('UseTimestampsAll').create({}, function(err, doc) {
      if (err) return done(err);

      console.log(doc);

      return done();

    });

  });

  after(function(done) {
    return mongoose.connection.close(done);
  });

});