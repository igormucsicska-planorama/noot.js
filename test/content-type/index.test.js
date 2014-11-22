/**
 * Dependencies
 */
var NOOT = nootrequire('content-type');


describe('NOOT.ContentType', function() {

  describe('.fromExtension()', function() {
    it('should get right content type', function() {
      NOOT.ContentType.fromExtension('html').should.eql('text/html');
    });
    it('should get right content type (dot in extension)', function() {
      NOOT.ContentType.fromExtension('.html').should.eql('text/html');
    });
  });

  describe('.fromPath()', function() {
    it('should get right content type', function() {
      NOOT.ContentType.fromPath('file.html').should.eql('text/html');
    });
  });

  describe('.toExtension()', function() {
    it('should get right extension', function() {
      NOOT.ContentType.toExtension('text/html').should.eql('html');
    });
  });

});