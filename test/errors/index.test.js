var NOOT = nootrequire('errors');

describe('NOOT.Errors', function() {
  describe('NOOT.Errors.InternalServerError', function() {
    it('should have right properties', function() {
      var err = new NOOT.Errors.InternalServerError('Bad things happened');
      err.statusCode.should.equal(500);
      err.name.should.equal('InternalServerError');
      err.code.should.equal('InternalServerError');
    });
  });
  describe('NOOT.Errors.NotImplemented', function() {
    it('should have right properties', function() {
      var err = new NOOT.Errors.NotImplemented('Bad things happened');
      err.statusCode.should.equal(501);
      err.name.should.equal('NotImplementedError');
      err.code.should.equal('NotImplementedError');
    });
  });
  describe('NOOT.Errors.BadRequest', function() {
    it('should have right properties', function() {
      var err = new NOOT.Errors.BadRequest('Bad things happened');
      err.statusCode.should.equal(400);
      err.name.should.equal('BadRequestError');
      err.code.should.equal('BadRequestError');
    });
  });
  describe('NOOT.Errors.Unauthorized', function() {
    it('should have right properties', function() {
      var err = new NOOT.Errors.Unauthorized('Bad things happened');
      err.statusCode.should.equal(401);
      err.name.should.equal('UnauthorizedError');
      err.code.should.equal('UnauthorizedError');
    });
  });
  describe('NOOT.Errors.Forbidden', function() {
    it('should have right properties', function() {
      var err = new NOOT.Errors.Forbidden('Bad things happened');
      err.statusCode.should.equal(403);
      err.name.should.equal('ForbiddenError');
      err.code.should.equal('ForbiddenError');
    });
  });
  describe('NOOT.Errors.NotFound', function() {
    it('should have right properties', function() {
      var err = new NOOT.Errors.NotFound('Bad things happened');
      err.statusCode.should.equal(404);
      err.name.should.equal('NotFoundError');
      err.code.should.equal('NotFoundError');
    });
  });
  describe('NOOT.Errors.Conflict', function() {
    it('should have right properties', function() {
      var err = new NOOT.Errors.Conflict('Bad things happened');
      err.statusCode.should.equal(409);
      err.name.should.equal('ConflictError');
      err.code.should.equal('ConflictError');
    });
  });
});