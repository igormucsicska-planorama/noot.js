/**
* Dependencies
*/
var NOOT = nootrequire('core-object');

/**
* Person Class
*/
var Person = NOOT.CoreObject.extend({
  firstName: '',
  lastName: '',

  getFullName: function() {
    return this.firstName + ' ' + this.lastName;
  },

  sayHello: function() {
    return 'Hello, my name is ' + this.getFullName();
  }

}, {
  doSomeStuff: function() {}
});

/**
* Employee Class
*/
var Employee = Person.extend({
  job: '',

  sayHello: function() {
    return this._super() + ', I work as a ' + this.job;
  }
});



describe('NOOT.CoreObject', function() {
  describe('.extend()', function() {
    it('instanceof should return true (parent class)', function() {
      var person = Person.create();
      (person instanceof Person).should.be.true;
    });
    it('instanceof should return true (child class)', function() {
      var employee = Employee.create();
      (employee instanceof Employee).should.be.true;
      (employee instanceof Person).should.be.true;
    });
    it('child should inherit prototype method from parent', function() {
      Employee.prototype.getFullName.should.be.a.function;
    });
    it('child should inherit static method from parent', function() {
      Employee.doSomeStuff.should.be.a.function;
    });
    it('should define `superClass` property', function() {
      Person.superClass.should.eql(NOOT.CoreObject);
      Employee.superClass.should.eql(Person);
    });
  });
  describe('.detect()', function() {
    it('should detect child class', function() {
      Person.detect(Employee).should.eql(true);
    });
    it('should detect itself', function() {
      Person.detect(Person).should.eql(true);
    });
    it('should not detect parent class', function() {
      Employee.detect(Person).should.eql(false);
    });
  });
  describe('.create()', function() {
    it('should concatenate properties (defined on instance)', function() {
      var Player = Person.extend({ hobbies: ['foot'] });
      var player = Player.create({ hobbies: ['basket'], concatenatedProperties: ['hobbies'] });
      player.hobbies.should.deep.eql(['foot', 'basket']);
    });
    it('should concatenate properties (defined on prototype)', function() {
      var Player = Person.extend({ hobbies: ['foot'], concatenatedProperties: ['hobbies'] });
      var player = Player.create({ hobbies: ['basket'] });
      player.hobbies.should.deep.eql(['foot', 'basket']);
    });
    it('should not concatenate properties', function() {
      var Player = Person.extend({ hobbies: ['foot'] });
      var player = Player.create({ hobbies: ['basket'], concatenatedProperties: ['name'] });
      player.hobbies.should.deep.eql(['basket']);
    });
  });
});