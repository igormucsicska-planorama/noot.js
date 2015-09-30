var NOOT = nootrequire('api');

describe('NOOT.API.Fields.String', function() {

  var field = NOOT.API.Fields.String.create({ path: 'foo' });
  var requiredField = NOOT.API.Fields.String.create({ path: 'foo', isRequired: true });

  describe('.prototype.parseQueryString()', function() {
    it('should parse into a String', function() {
      field.parseFromQueryString('foo').should.eql('foo');
    });
    it('should parse into null', function() {
      NOOT.isNull(field.parseFromQueryString('null')).should.eql(true);
    });
  });

  describe('.prototype.validate()', function() {
    it('should validate a valid string', function() {
      field.validate('foo').should.eql(true);
    });
    it('should validate null', function() {
      field.validate(null).should.eql(true);
    });
    it('should not validate a number', function() {
      field.validate(123).should.eql(false);
    });
    it('should return false (missing parameter)', function() {
      requiredField.validate().should.eql(false);
      requiredField.validate(null).should.eql(false);
    });
  });

});