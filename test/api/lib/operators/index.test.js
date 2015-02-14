var NOOT = nootrequire('api');
var Operators = NOOT.API.Operators;

describe('NOOT.API.Operators', function() {

  describe('.eq', function() {
    describe('.parseFromQueryString()', function() {
      it('should return value as it was (noop parser)', function(done) {
        Operators.eq.parseFromQueryString('value', function(val) { return val; }, function(err, value) {
          if (err) return done(err);
          value.should.eql('value');
          return done();
        });
      });
      it('should return value as a number', function(done) {
        Operators.eq.parseFromQueryString('5', function(val) { return parseInt(val); }, function(err, value) {
          if (err) return done(err);
          value.should.eql(5);
          return done();
        });
      });
    });
  });

  describe('.ne', function() {
    it('should return value as it was (noop parser)', function(done) {
      Operators.eq.parseFromQueryString('value', function(val) { return val; }, function(err, value) {
        if (err) return done(err);
        value.should.eql('value');
        return done();
      });
    });
    it('should return value as a number', function(done) {
      Operators.eq.parseFromQueryString('5', function(val) { return parseInt(val); }, function(err, value) {
        if (err) return done(err);
        value.should.eql(5);
        return done();
      });
    });
  });

  describe('.gt', function() {
    it('should return value as it was (noop parser)', function(done) {
      Operators.eq.parseFromQueryString('value', function(val) { return val; }, function(err, value) {
        if (err) return done(err);
        value.should.eql('value');
        return done();
      });
    });
    it('should return value as a number', function(done) {
      Operators.eq.parseFromQueryString('5', function(val) { return parseInt(val); }, function(err, value) {
        if (err) return done(err);
        value.should.eql(5);
        return done();
      });
    });
  });

  describe('.gte', function() {
    it('should return value as it was (noop parser)', function(done) {
      Operators.eq.parseFromQueryString('value', function(val) { return val; }, function(err, value) {
        if (err) return done(err);
        value.should.eql('value');
        return done();
      });
    });
    it('should return value as a number', function(done) {
      Operators.eq.parseFromQueryString('5', function(val) { return parseInt(val); }, function(err, value) {
        if (err) return done(err);
        value.should.eql(5);
        return done();
      });
    });
  });

  describe('.lt', function() {
    it('should return value as it was (noop parser)', function(done) {
      Operators.eq.parseFromQueryString('value', function(val) { return val; }, function(err, value) {
        if (err) return done(err);
        value.should.eql('value');
        return done();
      });
    });
    it('should return value as a number', function(done) {
      Operators.eq.parseFromQueryString('5', function(val) { return parseInt(val); }, function(err, value) {
        if (err) return done(err);
        value.should.eql(5);
        return done();
      });
    });
  });

  describe('.lt', function() {
    it('should return value as it was (noop parser)', function(done) {
      Operators.eq.parseFromQueryString('value', function(val) { return val; }, function(err, value) {
        if (err) return done(err);
        value.should.eql('value');
        return done();
      });
    });
    it('should return value as a number', function(done) {
      Operators.eq.parseFromQueryString('5', function(val) { return parseInt(val); }, function(err, value) {
        if (err) return done(err);
        value.should.eql(5);
        return done();
      });
    });
  });

  describe('.in', function() {
    describe('.parseFromQueryString()', function() {
      it('should return an array of strings (noop parser)', function(done) {
        Operators.in.parseFromQueryString('val1, val2', function(val) { return val; }, function(err, value) {
          if (err) return done(err);
          value.should.deep.eql(['val1', 'val2']);
          return done();
        });
      });
      it('should return an array of numbers', function(done) {
        Operators.in.parseFromQueryString('5, 6', function(val) { return parseInt(val); }, function(err, value) {
          if (err) return done(err);
          value.should.eql([5, 6]);
          return done();
        });
      });
    });
  });

  describe('.nin', function() {
    describe('.parseFromQueryString()', function() {
      it('should return an array of strings (noop parser)', function(done) {
        Operators.in.parseFromQueryString('val1, val2', function(val) { return val; }, function(err, value) {
          if (err) return done(err);
          value.should.deep.eql(['val1', 'val2']);
          return done();
        });
      });
      it('should return an array of numbers', function(done) {
        Operators.in.parseFromQueryString('5, 6', function(val) { return parseInt(val); }, function(err, value) {
          if (err) return done(err);
          value.should.eql([5, 6]);
          return done();
        });
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
      it('should build a regex ', function(done) {
        Operators.regex.parseFromQueryString('/abc//gi', null, function(err, value) {
          if (err) return done(err);
          value.should.deep.eql(new RegExp('abc/', 'gi'));
          return done();
        });
      });
      it('should build a regex ', function(done) {
        Operators.regex.parseFromQueryString('/abc\//gi', null, function(err, value) {
          if (err) return done(err);
          value.should.deep.eql(new RegExp('abc\/', 'gi'));
          return done();
        });
      });
      it('should build a regex ', function(done) {
        Operators.regex.parseFromQueryString('/abc\\//i', null, function(err, value) {
          if (err) return done(err);
          value.should.deep.eql(new RegExp('abc\\/', 'i'));
          return done();
        });
      });
      it('should build a regex ', function(done) {
        Operators.regex.parseFromQueryString('/abc(.)*/i', null, function(err, value) {
          if (err) return done(err);
          value.should.deep.eql(new RegExp('abc(.)*', 'i'));
          return done();
        });
      });
      it('should build a regex ', function(done) {
        Operators.regex.parseFromQueryString('/abc(\.)*/g', null, function(err, value) {
          if (err) return done(err);
          value.should.deep.eql(new RegExp('abc(\.)*', 'g'));
          return done();
        });
      });
    });
  });

});