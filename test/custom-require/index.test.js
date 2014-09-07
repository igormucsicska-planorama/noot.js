var NOOT = nootrequire('custom-require');
var path = require('path');

describe('NOOT.CustomRequire', function() {
  it('should return a function and not attach it to global', function() {
    var testrequire = NOOT.CustomRequire.create({ name: 'testrequire' });
    NOOT.isUndefined(global.testrequire).should.equal(true);
    testrequire.should.be.a('function');
  });
  it('should attach `testrequire` to global context', function() {
    var testrequire = NOOT.CustomRequire.create({
      name: 'testrequire',
      global: true,
      rootDirectory: path.resolve(__dirname, '../')
    });

    global.testrequire.should.equal(testrequire);
  });
  it('should require module from /test directory', function() {
    var fakemodule = testrequire('custom-require/fake-module');
    fakemodule.should.have.key('foo');
  });
});