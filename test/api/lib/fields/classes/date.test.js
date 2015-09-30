var NOOT = nootrequire('api');
var moment = require('moment');


describe('NOOT.API.Fields.Date', function() {

  var field = NOOT.API.Fields.Date.create({ path: 'foo' });
  var requiredField = NOOT.API.Fields.Date.create({ path: 'foo', isRequired: true });

  describe('.prototype.parseFromQueryString()', function() {
    it('should return a valid date from timestamp', function() {
      var now = Date.now();
      field.parseFromQueryString(now.toString()).should.deep.eql(new Date(now));
    });
    it('should return a valid date from datetime', function() {
      var datetime = moment().format('YYYY/MM/DD HH:mm:ss');
      field.parseFromQueryString(datetime).should.deep.eql(new Date(Date.parse(datetime)));
    });
    it('should return null', function() {
      NOOT.isNull(field.parseFromQueryString('null')).should.eql(true);
    });
    it('should not return a valid date (bad timestamp)', function() {
      isNaN(field.parseFromQueryString(Date.now().toString() + 'd')).should.eql(true);
    });
    it('should not return a valid date (invalid datetime)', function() {
      isNaN(field.parseFromQueryString(moment().format('YYYY/22/DD HH:mm:ss'))).should.eql(true);
    });
  });

  describe('.prototype.isTimestamp()', function() {
    it('should return true', function() {
      field.isTimestamp(Date.now().toString()).should.eql(true);
    });
    it('should return false', function() {
      field.isTimestamp(Date.now.toString() + 'd').should.eql(false);
    });
  });

  describe('.prototype.validate()', function() {
    it('should validate a valid date', function() {
      field.validate(new Date()).should.eql(true);
    });
    it('should not validate an invalid date', function() {
      field.validate(new Date('foobarbaz')).should.eql(false);
    });
    it('should not validate null', function() {
      field.validate(null).should.eql(true);
    });
    it('should return false (missing parameter)', function() {
      requiredField.validate().should.eql(false);
      requiredField.validate(null).should.eql(false);
    });
  });

});