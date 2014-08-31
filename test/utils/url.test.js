/**
* Dependencies
*/
var Url = nootrequire('utils').Utils.Url;

describe('NOOT.Utils.Url', function() {

  describe('.join()', function() {
    it('should keep leading slash', function() {
      /^\//.test(Url.join('/my', 'wonderful', 'url')).should.equal.true;
    });
    it('should not add leading slash', function() {
      /^\//.test(Url.join('my', 'wonderful', 'url')).should.equal.false;
    });
    it('should keep protocol', function() {
      Url.join('http://my-site.com', 'wonderful', 'url').should.equal('http://my-site.com/wonderful/url');
    });
    it('should correctly mix protocol (multiple slashes)', function() {
      Url.join('http://', '//my-site.com', '/wonderful', 'url').should.equal('http://my-site.com/wonderful/url');
    });
    it('should return a valid url (multiple slashes)', function() {
      Url.join('http://', '//my-site.com/', '/wonderful//', '//url').should.equal('http://my-site.com/wonderful/url');
    });
  });

  describe('.ensureProtocol()', function() {
    it('should add HTTP protocol', function() {
      /^http:\/\//.test(Url.ensureProtocol('my-site.com/wonderful/url')).should.equal.true;
    });
    it('should add HTTPS protocol', function() {
      /^https:\/\//.test(Url.ensureProtocol('my-site.com/wonderful/url'), true).should.equal.true;
    });
    it('should not modify protocol', function() {
      /^https:\/\//.test(Url.ensureProtocol('http://my-site.com/wonderful/url')).should.equal.false;
    });
    it('should not modify protocol', function() {
      /^https:\/\//.test(Url.ensureProtocol('https://my-site.com/wonderful/url'), true).should.equal.true;
    });
    it('should not modify protocol', function() {
      /^https:\/\//.test(Url.ensureProtocol('http://my-site.com/wonderful/url'), false).should.equal.false;
    });
    it('should force HTTPS protocol', function() {
      /^https:\/\//.test(Url.ensureProtocol('http://my-site.com/wonderful/url', true)).should.equal.true;
    });
    it('should force HTTP protocol', function() {
      /^https:\/\//.test(Url.ensureProtocol('https://my-site.com/wonderful/url', false)).should.equal.true;
    });
  });

});