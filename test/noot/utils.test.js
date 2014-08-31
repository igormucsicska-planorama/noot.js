/**
 * Dependencies
 */
var NOOT = nootrequire();

describe('NOOT (utils)', function() {

  describe('.makeArray()', function() {
    it('should create an array from arguments', function() {
      (function() {
        NOOT.makeArray(arguments).should.deep.equal([1, 2, 3]);
      })(1, 2, 3);
    });
    it('should create an array from arguments (empty)', function() {
      (function() {
        NOOT.makeArray(arguments).should.deep.equal([]);
      })();
    });
    it('should return the parameter array', function() {
      var param = [1, 2, 3];
      (NOOT.makeArray(param) === param).should.equal(true);
    });
  });

});