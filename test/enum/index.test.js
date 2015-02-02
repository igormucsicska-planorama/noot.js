var NOOT = nootrequire('enum');

describe('NOOT.Enum', function() {

  var enumeration = NOOT.Enum.create({ foo: 'bar', bar: 'foo', obj: { a: 'property' } });

  describe('.create()', function() {
    it('should attach parameter object to `_map`', function() {
      enumeration._map.should.deep.eql({ foo: 'bar', bar: 'foo', obj: { a: 'property' } });
    });

    it('should attach parameter keys to instance', function() {
      enumeration.hasOwnProperty('foo').should.eql(true);
      enumeration.hasOwnProperty('bar').should.eql(true);
      enumeration.hasOwnProperty('obj').should.eql(true);
    });
  });

  describe('.prototype.hasKey()', function() {
    it('should return true', function() {
      enumeration.hasKey('foo').should.eql(true);
    });
    it('should return false (non existing key)', function() {
      enumeration.hasKey('FOO').should.eql(false);
    });
    it('should return false (key is not in `_map`)', function() {
      enumeration.hasKey('hasKey').should.eql(false);
    });
  });

  describe('.prototype.hasValue()', function() {
    it('should return true', function() {
      enumeration.hasValue('foo').should.eql(true);
    });
    it('should return false', function() {
      enumeration.hasValue('toto').should.eql(false);
    });
  });

  describe('.prototype.getKey()', function() {
    it('should return corresponding key', function() {
      enumeration.getKey('bar').should.eql('foo');
    });
    it('should return undefined', function() {
      (enumeration.getKey('toto') === undefined).should.eql(true);
    });
  });

  describe('.prototype.get()', function() {
    it('should return corresponding value', function() {
      enumeration.get('foo').should.eql('bar');
    });
    it('should return undefined', function() {
      (enumeration.get('toto') === undefined).should.eql(true);
    });
    it('should not return instance\' property', function() {
      (enumeration.get('_map') === undefined).should.eql(true);
    });
  });

  describe('.prototype.set()', function() {
    it('should define a new property', function() {
      enumeration.set('anotherProperty', 'anotherProperty');
      enumeration.get('anotherProperty').should.eql('anotherProperty');
    });
    it('should have attached new property to `_map`', function() {
      enumeration._map.anotherProperty.should.eql('anotherProperty');
    });
  });

  describe('.prototype.values', function() {
    it('should contains all values', function() {
      enumeration.values.should.deep.eql(['bar', 'foo', enumeration.obj, 'anotherProperty']);
    });
  });

  describe('.prototype.keys', function() {
    it('should contains all keys', function() {
      enumeration.keys.should.deep.eql(['foo', 'bar', 'obj', 'anotherProperty']);
    });
  });

});