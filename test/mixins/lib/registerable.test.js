var NOOT = nootrequire('mixins', 'namespace');


describe('NOOT.Mixins.Registerable', function() {

  var Namespace = NOOT.Namespace.extend(NOOT.Mixins.Registerable).create({
    foo: 'bar',
    bar: 'foo'
  });

  describe('.register()', function() {

    it('should have added `register` method', function() {
      Namespace.register.should.be.a('function');
    });

    it('should add a new property to namespace', function() {
      Namespace.register('a', 'property');
      Namespace.a.should.a('string');
    });

    it('should not add a new property (conflict)', function() {
      (function() {
        Namespace.register('foo', 'bar');
      }).should.throw(/override/gi);
    });

    it('should throw if not enough arguments', function() {
      (function() {
        Namespace.register('empty');
      }).should.throw(/enough/gi);
    });

  });

});