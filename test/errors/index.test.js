var NOOT = nootrequire('errors');

describe('NOOT.Errors', function() {
  describe('InternalServerError', function() {
    it('should have right properties', function() {
      var err = new NOOT.Errors.InternalServerError('Bad things happened');
      err.statusCode.should.equal(500);
      err.name.should.equal('InternalServerError');
      err.code.should.equal('InternalServerError');
    });
  });

  describe('NotImplemented', function() {
    it('should have right properties', function() {
      var err = new NOOT.Errors.NotImplemented('Bad things happened');
      err.statusCode.should.equal(501);
      err.name.should.equal('NotImplementedError');
      err.code.should.equal('NotImplementedError');
    });
  });

  describe('Unavailable', function() {
    it('should have right properties', function() {
      var err = new NOOT.Errors.Unavailable('Bad things happened');
      err.statusCode.should.equal(503);
      err.name.should.equal('UnavailableError');
      err.code.should.equal('UnavailableError');
    });
  });

  describe('BadRequest', function() {
    it('should have right properties', function() {
      var err = new NOOT.Errors.BadRequest('Bad things happened');
      err.statusCode.should.equal(400);
      err.name.should.equal('BadRequestError');
      err.code.should.equal('BadRequestError');
    });
  });

  describe('Unauthorized', function() {
    it('should have right properties', function() {
      var err = new NOOT.Errors.Unauthorized('Bad things happened');
      err.statusCode.should.equal(401);
      err.name.should.equal('UnauthorizedError');
      err.code.should.equal('UnauthorizedError');
    });
  });

  describe('Forbidden', function() {
    it('should have right properties', function() {
      var err = new NOOT.Errors.Forbidden('Bad things happened');
      err.statusCode.should.equal(403);
      err.name.should.equal('ForbiddenError');
      err.code.should.equal('ForbiddenError');
    });
  });

  describe('NotFound', function() {
    it('should have right properties', function() {
      var err = new NOOT.Errors.NotFound('Bad things happened');
      err.statusCode.should.equal(404);
      err.name.should.equal('NotFoundError');
      err.code.should.equal('NotFoundError');
    });
  });

  describe('Conflict', function() {
    it('should have right properties', function() {
      var err = new NOOT.Errors.Conflict('Bad things happened');
      err.statusCode.should.equal(409);
      err.name.should.equal('ConflictError');
      err.code.should.equal('ConflictError');
    });
  });

  describe('.fromMongoose()', function() {

  });

  describe('.fromStatusCode()', function() {
    it('should return right instance type', function() {
      NOOT.Errors.fromStatusCode(409).should.be.an.instanceOf(NOOT.Errors.Conflict);
    });
    it('should return an InternalServerError for unknown statusCode', function() {
      NOOT.Errors.fromStatusCode(1111).should.be.an.instanceOf(NOOT.Errors.InternalServerError);
    });
    it('should have passed arguments to error class', function() {
      NOOT.Errors.fromStatusCode(409, 'Bad things happened').message.should.eql('Bad things happened');
    });
  });
});