var NOOT = nootrequire('api');


describe('NOOT.API.Fields.Integer', function() {

  var field = NOOT.API.Fields.Integer.create({ path: 'foo' });

  describe('.prototype.parseFromQueryString()', function() {
    it('should return an integer', function() {
      field.parseFromQueryString('123').should.eql(123);
      field.parseFromQueryString('123.45').should.eql(123);
    });
    it('should return NaN', function() {
      field.parseFromQueryString('d123d').should.eql(NaN);
    });
    it('should return null', function() {
      NOOT.isNull(field.parseFromQueryString('null')).should.eql(true);
    });
  });

});