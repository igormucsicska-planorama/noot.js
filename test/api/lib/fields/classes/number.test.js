var NOOT = nootrequire('api');

describe('NOOT.API.Fields.Number', function() {

  var field = NOOT.API.Fields.Number.create({ path: 'foo' });
  var requiredField = NOOT.API.Fields.Number.create({ path: 'foo', isRequired: true });

  describe('.prototype.parseFromQueryString()', function() {
    it('should return a valid number', function() {
      field.parseFromQueryString('123').should.eql(123);
      field.parseFromQueryString('0123').should.eql(123);
      field.parseFromQueryString('123.45').should.eql(123.45);
      field.parseFromQueryString('123.450').should.eql(123.45);
    });
    it('should return NaN', function() {
      field.parseFromQueryString('d123d').should.eql(NaN);
    });
  });

  describe('.prototype.validate()', function() {
    it('should validate a valid number', function() {
      field.validate(123).should.eql(true);
    });
    it('should not validate an invalid number', function() {
      field.validate(NaN).should.eql(false);
      field.validate('qsdgqsd').should.eql(false);
    });
    it('should return false (missing parameter)', function() {
      requiredField.validate().should.eql(false);
      requiredField.validate(null).should.eql(false);
    });
  });

});