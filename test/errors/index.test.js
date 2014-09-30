var NOOT = nootrequire('errors');

describe('NOOT.Errors', function() {
  it('InternalServerError should have right properties', function() {
    var err = new NOOT.Errors.InternalServerError('Bad things happened');
    err.statusCode.should.equal(500);
    err.name.should.equal('InternalServerError');
    err.code.should.equal('InternalServerError');
  });
  it('NotImplemented should have right properties', function() {
    var err = new NOOT.Errors.NotImplemented('Bad things happened');
    err.statusCode.should.equal(501);
    err.name.should.equal('NotImplementedError');
    err.code.should.equal('NotImplementedError');
  });
  it('Unavailable should have right properties', function() {
    var err = new NOOT.Errors.Unavailable('Bad things happened');
    err.statusCode.should.equal(503);
    err.name.should.equal('UnavailableError');
    err.code.should.equal('UnavailableError');
  });
  it('BadRequest should have right properties', function() {
    var err = new NOOT.Errors.BadRequest('Bad things happened');
    err.statusCode.should.equal(400);
    err.name.should.equal('BadRequestError');
    err.code.should.equal('BadRequestError');
  });
  it('Unauthorized should have right properties', function() {
    var err = new NOOT.Errors.Unauthorized('Bad things happened');
    err.statusCode.should.equal(401);
    err.name.should.equal('UnauthorizedError');
    err.code.should.equal('UnauthorizedError');
  });
  it('Forbidden should have right properties', function() {
    var err = new NOOT.Errors.Forbidden('Bad things happened');
    err.statusCode.should.equal(403);
    err.name.should.equal('ForbiddenError');
    err.code.should.equal('ForbiddenError');
  });
  it('NotFound should have right properties', function() {
    var err = new NOOT.Errors.NotFound('Bad things happened');
    err.statusCode.should.equal(404);
    err.name.should.equal('NotFoundError');
    err.code.should.equal('NotFoundError');
  });
  it('Conflict should have right properties', function() {
    var err = new NOOT.Errors.Conflict('Bad things happened');
    err.statusCode.should.equal(409);
    err.name.should.equal('ConflictError');
    err.code.should.equal('ConflictError');
  });
});