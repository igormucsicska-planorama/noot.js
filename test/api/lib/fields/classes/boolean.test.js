var NOOT = nootrequire('api');

describe('NOOT.API.Fields.Boolean', function() {

  var field = NOOT.API.Fields.Boolean.create({ path: 'foo' });
  var requiredField = NOOT.API.Fields.Boolean.create({ path: 'foo', isRequired: true });

  describe('.prototype.parseFromQueryString()', function() {
    it('should parse "true" as a true', function() {
      field.parseFromQueryString('true').should.eql(true);
    });
    it('should parse any other value as false', function() {
      field.parseFromQueryString(true).should.eql(false);
      field.parseFromQueryString(new Date()).should.eql(false);
      field.parseFromQueryString(123).should.eql(false);
      field.parseFromQueryString('false').should.eql(false);
    });
    it('should parse "null" as null', function() {
      NOOT.isNull(field.parseFromQueryString('null')).should.eql(true);
    });
  });

  describe('.prototype.validate()', function() {
    it('should validate a valid boolean', function() {
      field.validate(true).should.eql(true);
      field.validate(false).should.eql(true);
    });
    it('should not validate a number', function() {
      field.validate(123).should.eql(false);
    });
    it('should validate null', function() {
      field.validate(null).should.eql(true);
    });
    it('should return false (missing parameter)', function() {
      requiredField.validate().should.eql(false);
      requiredField.validate(null).should.eql(false);
    });
  });

});