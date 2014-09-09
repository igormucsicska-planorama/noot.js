var NOOT = nootrequire('error');


describe('NOOT.Error', function() {

  describe('Instance', function() {
    var err;
    it('should create an instance', function() {
      err = new NOOT.Error('Error message');
    });
    it('should inherit from Error', function() {
      NOOT.isError(err).should.equal(true);
    });
    it('should have right message', function() {
      err.message.should.equal('Error message');
    });
    it('should build a JSON object', function() {
      err.toJSON().should.have.keys(['error', 'code', 'message']);
    });
    it('should build a custom JSON object', function() {
      err.toJSON('name', 'code', 'statusCode').should.have.keys(['error', 'code', 'name', 'statusCode']);
    });
  });

  describe('Class', function() {
    var TestError = NOOT.Error.extend({ statusCode: 404, name: 'TestError', loggingLevel: 'warn' });

    it('should create an instance', function() {
      var err = new TestError('Error message');
      NOOT.isError(err).should.equal(true);
      err.message.should.equal('Error message');
      err.statusCode.should.equal(404);
      err.name.should.equal('TestError');
      err.code.should.equal('TestError');
      err.loggingLevel.should.equal('warn');
    });

    it('should inherit properties from parent', function() {
      var ChildError = TestError.extend({ name: 'ChildError' });
      var err = new ChildError('Error message');
      NOOT.isError(err).should.equal(true);
      err.message.should.equal('Error message');
      err.statusCode.should.equal(404);
      err.name.should.equal('ChildError');
      err.loggingLevel.should.equal('warn');
    });

  });

});