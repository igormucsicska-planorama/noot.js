/**
 * Dependencies
 */
var NOOT = nootrequire('mongoose');
var Schema = NOOT.Mongoose.Schema;
var async = require('async');
var mongoose = require('mongoose');
var Utils = require('../../test-utils');

var TEST_DB_NAME = 'noot-mongoose-schema-test';

var dbs = {
  main: null,
  one: null,
  two: null
};

/**
 * PersonMongooseSchema
 */
var PersonLegacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  job: { type: String },
  __type: { type: String }
} , {
  strict: false,
  collection: 'person',
  versionKey: false,
  autoIndex: false
});

/**
 * PersonSchema
 */
var PersonSchema = Schema.extend({
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
    versionKey: false,
    autoIndex: false
  }
});

/**
 * EmployeeSchema
 */
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
  schema: {
    job: { type: String, default: 'Developer' }
  }
});

/**
 * ArtistSchema
 */
var ArtistSchema = PersonSchema.extend({
  schema: {
    developer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Singer' }]
  }
});

/**
 * SingerSchema
 */
var SingerSchema = ArtistSchema.extend({
  schema: {
    type: { type: String }
  }
});


/**
 * Models
 */
var Person;
var Employee;
var Developer;
var PersonLegacy;
var Artist;
var Singer;

/**
 * Instances
 */
var him;
var her;
var me;
var artist;
var singer;
var personLegacy;
var employeeLegacy;
var developerLegacy;


var getItemFromList = function(item, list) {
  var id = item._id.toString();
  return list.filter(function(result) {
    return result._id.toString() === id;
  })[0];
};


describe('NOOT.Mongoose.Schema', function() {

  var Obj1Schema;
  var Obj2Schema;
  var ExtendObjSchema;
  var Obj1;
  var Obj2;
  var ExtendObj;
  var obj1;
  var obj2;
  var extendObj;

  before(function(done) {
    dbs.main = Utils.DB.create({ name: TEST_DB_NAME, drop: true }, function(err) {
      if (err) return done(err);

      /**
       * Models
       */
      Person = dbs.main.model('Person', PersonSchema);
      Employee = dbs.main.model('Employee', EmployeeSchema);
      Developer = dbs.main.model('Developer', DeveloperSchema);
      PersonLegacy = dbs.main.model('PersonLegacy', PersonLegacySchema);
      Artist = dbs.main.model('Artiste', ArtistSchema);
      Singer = dbs.main.model('Singer', SingerSchema);

      /**
       * @type {Person}
       */
      him = new Person({
        name: 'John Doe',
        age: 42
      });

      /**
       * @type {Employee}
       */
      her = new Employee({
        name: 'Jane Doe',
        job: 'Category expert',
        age: 38
      });

      /**
       * @type {Developer}
       */
      me = new Developer({
        name: 'Jean-Baptiste',
        age: 28
      });

      artist = new Artist({
        name: 'Alice Doe',
        age: 19
      });

      singer = new Singer({
        name: 'Frank Doe',
        type: 'Rock',
        age: 26
      });

      /**
       * @type {PersonLegacy}
       */
      personLegacy = new PersonLegacy ({
        name: 'Carol Doe',
        age: 112
      });

      employeeLegacy = new PersonLegacy ({
        name: 'Lisa Doe',
        age: 35,
        __type: 'Employee'
      });

      developerLegacy = new PersonLegacy ({
        name: 'Bryan Doe',
        age: 34,
        __type: 'Developer'
      });

      return done();
    });
  });

  before(function(done) {
    PersonLegacy.ensureIndexes();
    Person.ensureIndexes();
    Employee.ensureIndexes();
    Developer.ensureIndexes();
    Artist.ensureIndexes();
    Singer.ensureIndexes();
    return done();
  });

  before(function(done) {
    return async.each([
      { name: TEST_DB_NAME + 'db1', reference: 'one' },
      { name: TEST_DB_NAME + 'db2', reference: 'two' }
    ], function(item, cb) {
      dbs[item.reference] = Utils.DB.create({ name: item.name, drop: true }, cb);
    }, done);
  });

  before(function(done) {

    /**
     * Obj1Schema
     *
     */
    Obj1Schema = Schema.extend({
      schema: {
        title: { type: String, required: true }
      },

      options: {
        strict: false,
        collection: 'obj',
        versionKey: false
      }
    });

    /**
     * Obj2Schema
     *
     */
    Obj2Schema = Obj1Schema.extend();

    /**
     * Obj2Schema
     *
     */
    ExtendObjSchema = Obj1Schema.extend();

    /**
     * Models
     */
    Obj1 = dbs.one.model('Obj', Obj1Schema);
    Obj2 = dbs.two.model('Obj', Obj2Schema);
    ExtendObj = dbs.one.model('ExtendObj', ExtendObjSchema);

    /**
     * @type {Obj1}
     */
    obj1 = new Obj1({
      title: 'Object 1'
    });

    /**
     * @type {Obj2}
     */
    obj2 = new Obj2({
      title: 'Object2'
    });

    /**
     * @type {Obj3}
     */
    extendObj = new ExtendObj({
      title: 'Object3'
    });

    return async.each([obj1, obj2, extendObj], function(item, cb) {
      return item.save(cb);
    }, done);

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
    SingerSchema.__nootDef.schema.name.should.deep.eql({ type: String, required: true });
    return DeveloperSchema.__nootDef.schema.name.should.deep.eql({ type: String, required: true });
  });

  it('should insert documents with right values', function(done) {
    return async.eachSeries([me, her, him, artist, singer, personLegacy, employeeLegacy, developerLegacy],
        function(item, cb) {
          return item.save(cb);
        }, function(err) {
          if (err) return done(err);

          return Person.find(function(err, results) {
            if (err) return done(err);

            var retrievedLegacyPerson = getItemFromList(personLegacy, results);
            var retrievedMe = getItemFromList(me, results);
            var retrievedHer = getItemFromList(her, results);
            var retrievedHim = getItemFromList(him, results);
            var retrievedArtist = getItemFromList(artist, results);
            var retrievedSinger = getItemFromList(singer, results);

            retrievedLegacyPerson.name.should.be.eql('Carol Doe');
            retrievedLegacyPerson.age.should.be.eql(112);

            retrievedMe.name.should.be.eql('Jean-Baptiste');
            retrievedMe.job.should.be.eql('Developer');
            retrievedMe.age.should.be.eql(28);

            retrievedHim.name.should.be.eql('John Doe');
            retrievedHim.age.should.be.eql(42);

            retrievedHer.name.should.be.eql('Jane Doe');
            retrievedHer.job.should.be.eql('Category expert');
            retrievedHer.age.should.be.eql(38);

            retrievedArtist.name.should.be.eql('Alice Doe');
            retrievedArtist.age.should.be.eql(19);

            retrievedSinger.name.should.be.eql('Frank Doe');
            retrievedSinger.type.should.be.eql('Rock');
            retrievedSinger.age.should.be.eql(26);

            return done();
          });
        });
  });

  it('should migrate Employee', function(done) {
    return Employee.migrate({ '__type' : 'Employee' }, function() {
      return Employee.findOne({ 'name' : 'Lisa Doe' }, function (err, item) {
        if (err) return done(err);
        item.__t.should.be.eql('Employee');
        item.__ts.should.have.members(['Person', 'Employee']);
        return done();
      });
    });
  });

  it('should migrate Developer', function(done) {
    return Developer.migrate({ '__type' : 'Developer' }, function() {
      return Employee.findOne({ 'name' : 'Bryan Doe' }, function (err, item) {
        if (err) return done(err);
        item.__t.should.be.eql('Developer');
        item.__ts.should.have.members(['Person', 'Employee', 'Developer']);
        return done();
      });
    });
  });

  it('should associate right model', function(done) {
    return Person.find(function(err, results) {
      if (err) return done(err);
      results.length.should.eql(8);

      [{ person: him, class: Person }, { person: her, class: Employee }, { person: me, class: Developer },
        { person: artist, class: Artist }, { person: singer, class: Singer }, { person : personLegacy, class: Person },
      { person: employeeLegacy, class: Employee }, { person: developerLegacy, class: Developer }]
          .forEach(function(item) {
            (getItemFromList(item.person, results) instanceof item.class).should.eql(true);
          });

      return done();
    });
  });

  it('should find all Person at least 38 years old', function(done) {
    return Person.find({ age: { $gte: 38 } }, function(err, items) {
      if (err) return done(err);
      items.length.should.eql(3);
      return done();
    });
  });

  it('should find all Person (name field only) at least 40 years old', function(done) {
    return Person.find({ age: { $gte: 40 } }, 'name', function(err, items) {
      if (err) return done(err);

      items.length.should.eql(2);

      var retrievedHim = getItemFromList(him, items);
      var retrievedLegacyPerson = getItemFromList(personLegacy, items);

      retrievedHim.toObject().should.have.keys('name', '_id');
      retrievedHim.name.should.eql('John Doe');
      retrievedLegacyPerson.toObject().should.have.keys('name', '_id');
      retrievedLegacyPerson.name.should.eql('Carol Doe');

      return done();
    });
  });

  it('should find all Person (name field only) at least 36 years old with sort option', function(done) {
    return Person.find({ age: { $gte: 36 } }, 'name', { sort : 'name' }).exec(function(err, items) {
      if (err) return done(err);

      items.length.should.eql(3);

      var retrievedLegacyPerson = getItemFromList(personLegacy, items);
      var retrievedHer = getItemFromList(her, items);
      var retrievedHim = getItemFromList(him, items);

      retrievedLegacyPerson.should.eql(items[0]);
      retrievedHer.should.eql(items[1]);
      retrievedHim.should.eql(items[2]);

      retrievedLegacyPerson.toObject().should.have.keys('name', '_id');
      retrievedHer.toObject().should.have.keys('name', '_id');
      retrievedHim.toObject().should.have.keys('name', '_id');

      retrievedLegacyPerson.name.should.be.eql('Carol Doe');
      retrievedHer.name.should.be.eql('Jane Doe');
      retrievedHim.name.should.be.eql('John Doe');

      return done();
    });
  });

  it('should find all Person (name field only) at least 36 years old with sort option (inverted sort)', function(done) {
    return Person.find({ age: { $gte: 36 } }, 'name', { sort : '-name' }).exec(function(err, items) {
      if (err) return done(err);

      items.length.should.eql(3);

      var retrievedLegacyPerson = getItemFromList(personLegacy, items);
      var retrievedHer = getItemFromList(her, items);
      var retrievedHim = getItemFromList(him, items);

      retrievedLegacyPerson.should.eql(items[2]);
      retrievedHer.should.eql(items[1]);
      retrievedHim.should.eql(items[0]);

      retrievedLegacyPerson.toObject().should.have.keys('name', '_id');
      retrievedHer.toObject().should.have.keys('name', '_id');
      retrievedHim.toObject().should.have.keys('name', '_id');

      retrievedLegacyPerson.name.should.be.eql('Carol Doe');
      retrievedHer.name.should.be.eql('Jane Doe');
      retrievedHim.name.should.be.eql('John Doe');

      return done();
    });

  });

  it('should find only developers', function(done) {
    return Developer.find().exec(function(err, items) {
      if (err) return done(err);
      items.length.should.eql(2);
      return done();
    });
  });

  it('should find only employees', function(done) {
    return Employee.find(function(err, items) {
      if (err) return done(err);
      items.length.should.eql(4);
      return done();
    });
  });

  it('should find all persons', function(done) {
    return Person.find(function(err, items) {
      if (err) return done(err);
      items.length.should.eql(8);
      return done();
    });
  });

  it('should find only persons (strict mode)', function(done) {
    return Person.find({}, '', { strict: true }, function(err, items) {
      if (err) return done(err);
      items.length.should.eql(2);

      var retrievedHim = getItemFromList(him, items);
      var retrievedLegacyPerson = getItemFromList(personLegacy, items);

      retrievedHim.name.should.eql('John Doe');
      retrievedLegacyPerson.name.should.eql('Carol Doe');

      return done();
    });
  });

  it('should find one Developer', function(done) {
    return Developer.findOne(function(err, item) {
      if (err) return done(err);
      (item !== null).should.eql(true);
      item.name.should.eql('Jean-Baptiste');
      return done();
    });
  });

  it('should find two Obj in db1', function(done) {
    return Obj1.find(function(err, items) {
      if (err) return done(err);
      items.length.should.eql(2);
      return done();
    });
  });

  it('should find one extend of Obj in db1', function(done) {
    return ExtendObj.find(function(err, items) {
      if (err) return done(err);
      items.length.should.eql(1);
      return done();
    });
  });

  it('should find one Obj in db2', function(done) {
    return Obj2.find(function(err, items) {
      if (err) return done(err);
      items.length.should.eql(1);
      return done();
    });
  });

  it('should have middleware function attached', function() {
    return DeveloperSchema.useTimestamps.should.be.a('function');
  });

  after(function(done) {
    return async.each([dbs.main, dbs.one, dbs.two], function(db, cb) {
      return db.close(cb);
    }, done);
  });

});