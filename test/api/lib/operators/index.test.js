var NOOT = nootrequire('api');
var Operators = NOOT.API.Operators;

describe('NOOT.API.Operators', function() {

  describe('.eq', function() {
    describe('.parseFromQueryString()', function() {
      it('should return value as it was (noop parser)', function() {
        Operators.eq.parseFromQueryString('value', function(val) { return val; }).should.eql('value');
      });
      it('should return value as a number', function() {
        Operators.eq.parseFromQueryString('5', function(val) { return parseInt(val); }).should.eql(5);
      });
    });
  });

  describe('.ne', function() {
    describe('.parseFromQueryString()', function() {
      it('should return value as it was (noop parser)', function() {
        Operators.ne.parseFromQueryString('value', function(val) { return val; }).should.eql('value');
      });
      it('should return value as a number', function() {
        Operators.ne.parseFromQueryString('5', function(val) { return parseInt(val); }).should.eql(5);
      });
    });
  });

  describe('.gt', function() {
    describe('.parseFromQueryString()', function() {
      it('should return value as it was (noop parser)', function() {
        Operators.gt.parseFromQueryString('value', function(val) { return val; }).should.eql('value');
      });
      it('should return value as a number', function() {
        Operators.gt.parseFromQueryString('5', function(val) { return parseInt(val); }).should.eql(5);
      });
    });
  });

  describe('.gte', function() {
    describe('.parseFromQueryString()', function() {
      it('should return value as it was (noop parser)', function() {
        Operators.gte.parseFromQueryString('value', function(val) { return val; }).should.eql('value');
      });
      it('should return value as a number', function() {
        Operators.gte.parseFromQueryString('5', function(val) { return parseInt(val); }).should.eql(5);
      });
    });
  });

  describe('.lt', function() {
    describe('.parseFromQueryString()', function() {
      it('should return value as it was (noop parser)', function() {
        Operators.lte.parseFromQueryString('value', function(val) { return val; }).should.eql('value');
      });
      it('should return value as a number', function() {
        Operators.lte.parseFromQueryString('5', function(val) { return parseInt(val); }).should.eql(5);
      });
    });
  });

  describe('.lt', function() {
    describe('.parseFromQueryString()', function() {
      it('should return value as it was (noop parser)', function() {
        Operators.lt.parseFromQueryString('value', function(val) { return val; }).should.eql('value');
      });
      it('should return value as a number', function() {
        Operators.lt.parseFromQueryString('5', function(val) { return parseInt(val); }).should.eql(5);
      });
    });
  });

  describe('.in', function() {
    describe('.parseFromQueryString()', function() {
      it('should return an array of strings (noop parser)', function() {
        Operators.in.parseFromQueryString('val1, val2', function(val) { return val; }).should.deep.eql(['val1', 'val2']);
      });
      it('should return an array of numbers', function() {
        Operators.in.parseFromQueryString('5, 6', function(val) { return parseInt(val); }).should.eql([5, 6]);
      });
    });
  });

  describe('.nin', function() {
    describe('.parseFromQueryString()', function() {
      it('should return an array of strings (noop parser)', function() {
        Operators.nin.parseFromQueryString('val1, val2', function(val) {
          return val;
        }).should.deep.eql(['val1', 'val2']);
      });
      it('should return an array of numbers', function() {
        Operators.nin.parseFromQueryString('5, 6', function(val) { return parseInt(val); }).should.eql([5, 6]);
      });
    });
  });

  describe('.regex', function() {
    describe('.isValid()', function() {
      it('should be a valid regexp', function() {
        Operators.regex.isValid('/abc/').should.eql(true);
        Operators.regex.isValid('/abc/gi').should.eql(true);
        Operators.regex.isValid('/abc/igm').should.eql(true);
        Operators.regex.isValid('/abc//igm').should.eql(true);
      });

      it('should not be a valid regexp', function() {
        Operators.regex.isValid('abc/').should.eql(false);
        Operators.regex.isValid('/abc').should.eql(false);
        Operators.regex.isValid('/abc/uy').should.eql(false);
        Operators.regex.isValid('/abc/y').should.eql(false);
      });
    });
    describe('.parseFromQueryString()', function() {
      it('should build a regex', function() {
        Operators.regex.parseFromQueryString('/abc//gi').should.deep.eql(new RegExp('abc/', 'gi'));
        Operators.regex.parseFromQueryString('/abc\//gi').should.deep.eql(new RegExp('abc\/', 'gi'));
        Operators.regex.parseFromQueryString('/abc\\//i').should.deep.eql(new RegExp('abc\\/', 'i'));
        Operators.regex.parseFromQueryString('/abc(.)*/i').should.deep.eql(new RegExp('abc(.)*', 'i'));
        Operators.regex.parseFromQueryString('/abc(\.)*/g').should.deep.eql(new RegExp('abc(\.)*', 'g'));
      });
    });
  });

});