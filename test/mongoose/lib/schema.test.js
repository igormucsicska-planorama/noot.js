/**
 * Dependencies
 */
var NOOT = nootrequire('mongoose');
var Schema = NOOT.Mongoose.Schema;
var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');


var TEST_DB_NAME = 'noot-mongoose-schema-test';


/**
 * PersonSchema
 */
var PersonSchema = Schema.extend({
  modelName: 'Person',

  schema: {
    name: { type: String, required: true },
    age: { type: Number, required: true }
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

/**
 * EmployeeSchema
 */
var EmployeeSchema = PersonSchema.extend({
  modelName: 'Employee',

  schema: {
    job: String
  },

  methods: {
    sayHello: function() {
      return this._super() + ', I work as a ' + this.job;
    }
  },

  statics: {
    joinCompany: function () {
      return this._super();
    }
  },

  options: {
    strict: true
  }
});

/**
 * DeveloperSchema
 */
var DeveloperSchema = EmployeeSchema.extend({
  modelName: 'Developer',

  schema: {
    job: { type: String, default: 'Developer' }
  }
});

/**
 * Models
 */
var Person = mongoose.model('Person');
var Employee = mongoose.model('Employee');
var Developer = mongoose.model('Developer');

/**
 * @type {Person}
 */
var him = new Person({
  name: 'John Doe',
  age: 42
});

/**
 * @type {Employee}
 */
var her = new Employee({
  name: 'Jane Doe',
  job: 'Category expert',
  age: 38
});

/**
 * @type {Developer}
 */
var me = new Developer({
  name: 'Jean-Baptiste',
  age: 28
});


var getItemFromList = function(item, list) {
  var id = item._id.toString();
  return list.filter(function(result) {
    return result._id.toString() === id;
  })[0];
};


describe('NOOT.Mongoose.Schema', function() {
  before(function(done) {
    return mongoose.connect('mongodb://localhost:27017/' + TEST_DB_NAME, function() {
      return mongoose.connection.db.collectionNames(function(err, names) {
        if (err) return done(err);
        if (_.find(names, { name: TEST_DB_NAME + '.' + 'person' })) {
          return mongoose.connection.collection('person').drop(done);
        } else {
          return done();
        }
      });
    });
  });

  it('should inherit instance method', function() {
    return me.sayHello().should.eql('Hello, my name is Jean-Baptiste, I work as a Developer');
  });

  it('should inherit static method', function() {
    return Employee.joinCompany().should.eql('You joined');
  });

  it('should merge options', function() {
    return EmployeeSchema.options.strict.should.eql(true);
  });

  it('should inherit schema properties', function() {
    return DeveloperSchema.__nootDef.schema.name.should.deep.eql({ type: String, required: true });
  });

  it('should insert documents with right values', function(done) {
    return async.each([me, her, him], function(item, cb) {
      return item.save(cb);
    }, function(err) {
      if (err) return done(err);

      return Person.find(function(err, results) {
        if (err) return done(err);

        var retrievedMe = getItemFromList(me, results);
        var retrievedHer = getItemFromList(her, results);
        var retrievedHim = getItemFromList(him, results);

        retrievedMe.name.should.be.eql('Jean-Baptiste');
        retrievedMe.job.should.be.eql('Developer');
        retrievedMe.age.should.be.eql(28);

        retrievedHim.name.should.be.eql('John Doe');
        retrievedHim.age.should.be.eql(42);

        retrievedHer.name.should.be.eql('Jane Doe');
        retrievedHer.job.should.be.eql('Category expert');
        retrievedHer.age.should.be.eql(38);

        return done();
      });
    });
  });

  it('should associate right model', function(done) {
    return Person.find(function(err, results) {
      if (err) return done(err);
      results.length.should.eql(3);

      [{ person: him, class: Person }, { person: her, class: Employee }, { person: me, class: Developer }]
        .forEach(function(item) {
          (getItemFromList(item.person, results) instanceof item.class).should.eql(true);
        });

      return done();
    });
  });

  it('should find all Person', function(done) {
    return Person.find(function(err, items) {
      if (err) return done(err);
      items.length.should.eql(3);
      return done();
    });
  });

  it('should find all Person at least 38 years old', function(done) {
    return Person.find({ age: { $gte: 38 } }, function(err, items) {
      if (err) return done(err);
      items.length.should.eql(2);
      return done();
    });
  });

  it('should find all Person (name field only) at least 40 years old', function(done) {
    return Person.find({ age: { $gte: 40 } }, 'name', function(err, items) {
      if (err) return done(err);

      items.length.should.eql(1);

      var retrievedHim = items[0];

      retrievedHim.toObject().should.have.keys('name', '_id', '__type');
      retrievedHim.name.should.eql('John Doe');

      return done();
    });
  });

  it('should find all Person (name field only) at least 36 years old with sort option', function(done) {
    return Person.find({ age: { $gte: 36 } }, 'name', { sort : 'name' }).exec(function(err, items) {
      if (err) return done(err);

      items.length.should.eql(2);

      var retrievedHer = getItemFromList(her, items);
      var retrievedHim = getItemFromList(him, items);

      retrievedHer.should.eql(items[0]);
      retrievedHim.should.eql(items[1]);

      retrievedHer.toObject().should.have.keys('name', '_id', '__type');
      retrievedHim.toObject().should.have.keys('name', '_id', '__type');

      retrievedHer.name.should.be.eql('Jane Doe');
      retrievedHim.name.should.be.eql('John Doe');

      return done();
    });
  });

  it('should find all Person (name field only) at least 36 years old with sort option (inverted sort)', function(done) {
    return Person.find({ age: { $gte: 36 } }, 'name', { sort : '-name' }).exec(function(err, items) {
      if (err) return done(err);

      items.length.should.eql(2);

      var retrievedHer = getItemFromList(her, items);
      var retrievedHim = getItemFromList(him, items);

      retrievedHer.should.eql(items[1]);
      retrievedHim.should.eql(items[0]);

      retrievedHer.toObject().should.have.keys('name', '_id', '__type');
      retrievedHim.toObject().should.have.keys('name', '_id', '__type');

      retrievedHer.name.should.be.eql('Jane Doe');
      retrievedHim.name.should.be.eql('John Doe');

      return done();
    });
  });

  it('should find only developers', function(done) {
    return Developer.find().exec(function(err, items) {
      if (err) return done(err);
      items.length.should.eql(1);
      return done();
    });
  });

  it('should find only employees', function(done) {
    return Employee.find(function(err, items) {
      if (err) return done(err);
      items.length.should.eql(2);
      return done();
    });
  });

  it('should find all persons', function(done) {
    return Person.find(function(err, items) {
      if (err) return done(err);
      items.length.should.eql(3);
      return done();
    });
  });

  it('should find only persons (strict mode)', function(done) {
    return Person.find({}, '', { strict: true }, function(err, results) {
      if (err) return done(err);
      results.length.should.eql(1);
      results[0].name.should.eql('John Doe');
      return done();
    });
  });

  it('should not find one employee with __type=Person ', function(done) {
    return Person.find({ __type : 'Person' }).exec(function(err, results) {
      if (err) return done(err);
      Employee.findOne({ '_id': results[0]._id }).exec(function(err, item) {
        if (err) return done(err);
        (item === null).should.eql(true);
        return done();
      });
    });
  });

  it('should find one employee with __type=Developer ', function(done) {
    return Person.find({ __type : 'Developer' }).exec(function(err, results) {
      if (err) return done(err);
      Employee.findOne({ '_id': results[0]._id }).exec(function(err, item) {
        if (err) return done(err);
        (item instanceof Developer).should.eql(true);
        return done();
      });
    });
  });

  it('should find one employee with __type=Employee ', function(done) {
    return Person.find({ __type : 'Employee' }).exec(function(err, results) {
      if (err) return done(err);
      Employee.findOne({ '_id': results[0]._id }).exec(function(err, item) {
        if (err) return done(err);
        (item instanceof Employee).should.eql(true);
        return done();
      });
    });
  });

});