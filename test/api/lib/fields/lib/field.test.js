var NOOT = nootrequire('api');

var Field = NOOT.API.Field;

describe('NOOT.API.Field', function() {

  var field = Field.create({ path: 'foo' });
  var requiredField = Field.create({ path: 'foo', isRequired: true, supportedOperators: ['in'], plainPath: 'baz' });

  describe('.create()', function() {
    it('should create an instance with default values', function() {
      field.path.should.eql('foo');
      field.plainPath.should.eql('foo');
      field.isRequired.should.eql(false);
      field.isReference.should.eql(false);
      field.isReferenceArray.should.eql(false);
      field.supportedOperators.should.deep.eql([]);
      requiredField.plainPath.should.eql('baz');
    });
    it('should not create an instance (missing `path`)', function() {
      (function() { Field.create(); }).should.throw(/path/);
    });
  });

  describe('.prototype.toPublic()', function() {
    it('should return the parameter value', function() {
      field.toPublic('bar').should.eql('bar');
    });
  });

  describe('.prototype.toInternal()', function() {
    it('should return the parameter value', function() {
      field.toInternal('bar').should.eql('bar');
    });
  });

  describe('.prototype.parseFromQueryString()', function() {
    it('should return the parameter value', function() {
      field.parseFromQueryString('bar').should.eql('bar');
    });
  });

  describe('.prototype.validate()', function() {
    it('should validate a string', function() {
      field.validate('bar').should.eql(true);
      requiredField.validate('bar').should.eql(true);
    });
    it('should validate undefined value', function() {
      field.validate().should.eql(true);
      requiredField.validate().should.eql(false);
    });
    it('should validate null value', function() {
      field.validate(null).should.eql(true);
      requiredField.validate(null).should.eql(false);
    });
  });

  describe('.prototype.validateOperator()', function() {
    it('should return true', function() {
      requiredField.validateOperator().should.eql(true);
      requiredField.validateOperator('in').should.eql(true);
    });
    it('should return false', function() {
      requiredField.validateOperator('nin').should.eql(false);
    });
  });

});