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
    it('should return a new array', function() {
      var param = [1, 2, 3];
      var result = NOOT.makeArray(param);
      (result === param).should.eql(false);
      result.should.deep.eql(param);
    });
  });

  describe('.pickProperties()', function() {
    it('should return right properties', function() {
      NOOT.pickProperties({
        name: { first: 'Sylvain', last: 'Estevez', nick: 'Bob' },
        age: 28,
        password: 'youllnotfind',
        email: 'se@nootjs.com',
        addr: { street: 'rue de la Paix', nb: 5 }
      }, [
        'name.first',
        'name.last',
        'age',
        'email',
        'addr',
        'blogs',
        '_id'
      ]).should.deep.eql({
        name: { first: 'Sylvain', last: 'Estevez' },
        addr: { street: 'rue de la Paix', nb: 5 },
        age: 28,
        email: 'se@nootjs.com'
      });
    });
  });

  describe('.required()', function() {
    var obj = {
      book: 'JavaScript, The Good Parts',
      by: 'Douglas Crockford',
      promo: false
    };

    it('should throw an error', function() {
      (function() {
        return NOOT.required(obj, 'year', 'price');
      }).should.throw(/Mandatory parameters: `year`, `price`/);
    });

    it('should not throw an error', function() {
      (function() {
        return NOOT.required(obj, 'book', 'by', 'promo');
      }).should.not.throw();
    });

    it('should return a callback with an error', function(done) {
      return NOOT.required(obj, 'year', 'price', function(err) {
        err.message.should.match(/Mandatory parameters: `year`, `price`/);
        return done();
      });
    });

    it('should return a callback without an error', function(done) {
      return NOOT.required(obj, 'book', 'by', 'promo', function(err) {
        (err === undefined).should.be.equal(true);
        return done();
      });
    });


  });

});