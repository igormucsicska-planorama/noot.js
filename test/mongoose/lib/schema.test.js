var NOOT = nootrequire('mongoose');
var Schema = NOOT.Mongoose.Schema;
var mongoose = require('mongoose');
var async = require('async');



describe('NOOT.Mongoose.Schema', function() {
  before(function(done) {
    return mongoose.connect('mongodb://localhost:27017/noot-mongoose-schema-test', function() {
      return mongoose.connection.collection('person').drop(done);
    });
  });

  var PersonSchema = Schema.extend({
    schema: {
      name: { type: String, required: true }
    },
    methods: {
      sayHello: function() {
        return 'Hello, my name is ' + this.name;
      }
    },
    statics: {
      joinCompany: function() {
        return 'You joined';
      }
    },
    options: {
      strict: false,
      collection: 'person',
      versionKey: false
    }
  });

  var EmployeeSchema = PersonSchema.extend({
    schema: {
      job: String
    },
    methods: {
      sayHello: function() {
        return this._super() + ', I work as a ' + this.job;
      }
    },
    statics: {
      joinCompany: function(employee, company) {
        return this._super(employee, company);
      }
    },
    options: {
      strict: true
    }
  });

  var DeveloperSchema = EmployeeSchema.extend({
    schema: {
      job: { type: String, default: 'Developer' }
    }
  });


  var Person = mongoose.model('Person', PersonSchema);
  var Employee = mongoose.model('Employee', EmployeeSchema);
  var Developer = mongoose.model('Developer', DeveloperSchema);

  var me = new Developer({
    name: 'Jean-Baptiste',
    job: 'Developer'
  });

  var him = new Person({
    name: 'John Doe'
  });

  var her = new Employee({
    name: 'Jane Doe',
    job: 'Category expert'
  });

  it('should have required module', function() {
    Schema.should.be.a('function');
  });

  it('should inherit instance method', function() {
    me.sayHello().should.eql('Hello, my name is Jean-Baptiste, I work as a Developer');
  });

  it('should inherit static method', function() {
    Employee.joinCompany(me, { name: 'Planorama' }).should.eql('You joined');
  });

  it('should merge options', function() {
    EmployeeSchema.options.strict.should.eql(true);
  });

  it('should inherit schema properties', function() {
    DeveloperSchema.__nootDef.schema.name.should.deep.eql({ type: String, required: true });
  });

  it('should insert documents', function(done) {
    return async.series({
      me: function(cb) { return me.save(cb); },
      him: function(cb) { return him.save(cb); },
      her: function(cb) { return her.save(cb); }
    }, function(err, results) {
      if (err) return done(err);
      console.log(results);
      // TODO test each property for each result
      return done();
    });
  });

  it('should associate right model', function(done) {
    Person.find(function(err, results) {
      if (err) return done(err);
      results.length.should.eql(3);

      (results[0] instanceof Developer).should.eql(true);
      (results[1] instanceof Person).should.eql(true);
      (results[2] instanceof Employee).should.eql(true);

      return done();
    });
  });

});