/**
* Dependencies
*/
var NOOT = nootrequire('url');

describe('NOOT.Url', function() {

  describe('.join()', function() {
    it('should keep leading slash', function() {
      /^\//.test(NOOT.Url.join('/my', 'wonderful', 'url')).should.equal.true;
    });
    it('should not add leading slash', function() {
      /^\//.test(NOOT.Url.join('my', 'wonderful', 'url')).should.equal.false;
    });
    it('should keep protocol', function() {
      NOOT.Url.join('http://my-site.com', 'wonderful', 'url').should.equal('http://my-site.com/wonderful/url');
    });
    it('should correctly mix protocol (multiple slashes)', function() {
      NOOT.Url.join('http://', '//my-site.com', '/wonderful', 'url').should.equal('http://my-site.com/wonderful/url');
    });
    it('should return a valid url (multiple slashes)', function() {
      NOOT.Url.join('http://', '//my-site.com/', '/wonderful//', '//url')
        .should.equal('http://my-site.com/wonderful/url');
    });
  });

  describe('.ensureProtocol()', function() {
    it('should add HTTP protocol', function() {
      /^http:\/\//.test(NOOT.Url.ensureProtocol('my-site.com/wonderful/url')).should.equal(true);
    });
    it('should add HTTPS protocol', function() {
      /^https:\/\//.test(NOOT.Url.ensureProtocol('my-site.com/wonderful/url', true)).should.equal(true);
    });
    it('should not modify protocol', function() {
      /^https:\/\//.test(NOOT.Url.ensureProtocol('http://my-site.com/wonderful/url')).should.equal(false);
    });
    it('should not modify protocol', function() {
      /^https:\/\//.test(NOOT.Url.ensureProtocol('https://my-site.com/wonderful/url', true)).should.equal(true);
    });
    it('should not modify protocol', function() {
      /^https:\/\//.test(NOOT.Url.ensureProtocol('http://my-site.com/wonderful/url', false)).should.equal(false);
    });
    it('should force HTTPS protocol', function() {
      /^https:\/\//.test(NOOT.Url.ensureProtocol('http://my-site.com/wonderful/url', true)).should.equal(true);
    });
    it('should force HTTP protocol', function() {
      var ensured = NOOT.Url.ensureProtocol('https://my-site.com/wonderful/url', false);
      /^https:\/\//.test(ensured).should.equal(false);
      /^http:\/\//.test(ensured).should.equal(true);
    });
  });

});