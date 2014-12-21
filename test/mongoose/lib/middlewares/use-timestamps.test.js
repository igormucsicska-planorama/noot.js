var NOOT = nootrequire('mongoose');
var mongoose = require('mongoose');
var _ = require('lodash');
var Utils = require('../../../test-utils');

var Schema = NOOT.Mongoose.Schema;

var TEST_DB_NAME = 'noot-mongoose-middlewares-test';
var TEST_COLLECTION_NAME = 'use_timestamps';
var db;


var UseTimestamps;


describe('NOOT.Mongoose.useTimestamps()', function() {

  before(function(done) {
    db = Utils.DB.create({ name: TEST_DB_NAME, drop: true }, function(err) {
      if (err) return done(err);
      UseTimestamps = db.model('UseTimestamps', Schema.extend({
          schema: { foo: String, bar: Number },
          options: { collection: TEST_COLLECTION_NAME }
        })
        .useTimestamps()
      );

      return done();
    });
  });


  it('should contain middleware', function() {
    NOOT.Mongoose.useTimestamps.should.be.a('function');
  });

  it('should have added timings (from namespace)', function(done) {
    var schema = Schema.extend({ options: { collection: TEST_COLLECTION_NAME } });

    NOOT.Mongoose.useTimestamps(schema);

    var UseTimestampsNamespace = db.model('UseTimestampsAllNamespace', schema);

    var now = Date.now();
    var delta = 100;

    return UseTimestampsNamespace.create({}, function(err, doc) {
      if (err) return done(err);
      doc.createdOn.should.be.a('date');
      doc.updatedOn.should.be.a('date');

      doc.createdOn.getTime().should.be.within(now, now + delta);
      doc.updatedOn.getTime().should.be.within(now, now + delta);
      return done();
    });
  });

  it('should have added timings (from schema method)', function(done) {
    var schema = Schema
      .extend({ options: { collection: TEST_COLLECTION_NAME } })
      .useTimestamps();

    var UseTimestampsSchema = db.model('UseTimestampsSchema', schema);

    var now = Date.now();
    var delta = 100;

    return UseTimestampsSchema.create({}, function(err, doc) {
      if (err) return done(err);
      doc.createdOn.should.be.a('date');
      doc.updatedOn.should.be.a('date');
      doc.createdOn.getTime().should.be.within(now, now + delta);
      doc.updatedOn.getTime().should.be.within(now, now + delta);
      return done();
    });
  });

  it('should update `updatedOn`', function(done) {
    return UseTimestamps.create({}, function(err, item) {
      if (err) return done(err);

      return setTimeout(function() {
        var now = Date.now();
        var delta = 100;

        item.foo = 'toto';

        return item.save(function(err) {
          if (err) return done(err);
          item.foo.should.eql('toto');
          item.updatedOn.getTime().should.be.within(now, now + delta);
          return done();
        });

      }, 1000);
    });
  });

  it('should take properties names from options', function(done) {
    var schema = Schema
      .extend({ options: { collection: TEST_COLLECTION_NAME } })
      .useTimestamps({ createdOn: 'creaOn', updatedOn: 'modOn' });

    var UseTimestampsOptions = db.model('UseTimestampsOptions', schema);

    return UseTimestampsOptions.create({}, function(err, doc) {
      if (err) return done(err);
      doc.creaOn.should.be.a('date');
      doc.modOn.should.be.a('date');
      return done();
    });
  });

  after(function(done) {
    return db.close(done);
  });

});