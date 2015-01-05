var NOOT = nootrequire('api');
var ConditionsParser = NOOT.API.ConditionsParser;

describe('NOOT.API.ConditionsParser', function() {


  describe('.init()', function() {
    it('should create an instance', function() {
      (function() {
        ConditionsParser.create({
          fields: ['name.first', 'name.last', 'age', 'email'],
          operators: ['$eq', '$gt', '$gte', '$lt', '$lte', '$in', '$nin', '$ne']
        });
      }).should.not.throw();
    });

    it('should not create an instance (missing `fields`)', function() {
      (function() {
        ConditionsParser.create({
          operators: ['$eq', '$gt', '$gte', '$lt', '$lte', '$in', '$nin', '$ne']
        });
      }).should.throw(/fields/);
    });

    it('should not create an instance (missing `operators`)', function() {
      (function() {
        ConditionsParser.create({
          fields: ['name.first', 'name.last', 'age', 'email']
        });
      }).should.throw(/operators/);
    });
  });



  describe('prototype.compute() (unsafe)', function() {
    var parser = ConditionsParser.create({
      fields: ['name.first', 'name.last', 'age', 'email'],
      operators: ['$eq', '$gt', '$gte', '$lt', '$lte', '$in', '$nin', '$ne']
    });

    it('should parse filter (equality)', function() {
      parser.compute({
        'name.first__eq': 'Sylvain'
      }).should.deep.eql({
        'name.first': 'Sylvain'
      });

      parser.compute({
        'name.first': 'Sylvain'
      }).should.deep.eql({
        'name.first': 'Sylvain'
      });
    });

    it('should parse filter (exclude)', function() {
      parser.compute({
        'name.first__eq': 'Sylvain',
        'name': { foo: 'bar' }
      }).should.deep.eql({
        'name.first': 'Sylvain'
      });
    });

    it('should parse filter (multiple operators)', function() {
      parser.compute({
        'age__gt': 25,
        'age__lt': 30,
        'age__ne': 27,
        'name': 'Sylvain'
      }).should.deep.eql({
        age: { $gt: 25, $lt: 30, $ne: 27 }
      });
    });

    it('should parse filter (multiple operators including $eq)', function() {
      parser.compute({
        'age__gt': 25,
        'age__lt': 30,
        'age__eq': 27,
        'name': 'Sylvain'
      }).should.deep.eql({
        age: 27
      });
    });

    it('should parse filter (one operator includes a $ sign)', function() {
      parser.compute({
        'age__$gt': 25,
        'age__lt': 30,
        'age__ne': 27,
        'name': 'Sylvain'
      }).should.deep.eql({
        age: { $gt: 25, $lt: 30, $ne: 27 }
      });
    });

    it('should parse filter (invalid operator)', function() {
      parser.compute({
        'age__gt': 25,
        'age__lt': 30,
        'age__range': 27,
        'name': 'Sylvain'
      }).should.deep.eql({
        age: { $gt: 25, $lt: 30 }
      });
    });
  });

  describe('prototype.compute() (safe)', function() {
    var safeParser = ConditionsParser.create({
      fields: ['name.first', 'name.last', 'age', 'email'],
      operators: ['$eq', '$gt', '$gte', '$lt', '$lte', '$in', '$nin', '$ne'],
      shouldThrowOnInvalidField: true,
      shouldThrowOnInvalidOperator: true
    });


    it('should parse filter (equality)', function() {
      safeParser.compute({
        'name.first__eq': 'Sylvain'
      }).should.deep.eql({
        'name.first': 'Sylvain'
      });

      safeParser.compute({
        'name.first': 'Sylvain'
      }).should.deep.eql({
        'name.first': 'Sylvain'
      });
    });

    it('should parse filter (invalid field)', function() {
      (function() {
        safeParser.compute({
          'name.first__eq': 'Sylvain',
          'name': { foo: 'bar' }
        });
      }).should.throw('Invalid field: name');
    });

    it('should parse filter (multiple operators)', function() {
      safeParser.compute({
        'age__gt': 25,
        'age__lt': 30,
        'age__ne': 27
      }).should.deep.eql({
        age: { $gt: 25, $lt: 30, $ne: 27 }
      });
    });

    it('should parse filter (multiple operators including $eq)', function() {
      safeParser.compute({
        'age__gt': 25,
        'age__lt': 30,
        'age__eq': 27
      }).should.deep.eql({
        age: 27
      });
    });

    it('should parse filter (one operator includes a $ sign)', function() {
      safeParser.compute({
        'age__$gt': 25,
        'age__lt': 30,
        'age__ne': 27
      }).should.deep.eql({
        age: { $gt: 25, $lt: 30, $ne: 27 }
      });
    });

    it('should parse filter (invalid operator)', function() {
      (function() {
        safeParser.compute({
          'age__gt': 25,
          'age__lt': 30,
          'age__range': 27
        });
      }).should.throw('Invalid operator: $range');
    });

  });

  describe('prototype.parseMatch()', function() {
    var parser = ConditionsParser.create({
      fields: [],
      operators: []
    });

    it('should parse list of fields ($in)', function() {
      parser.parseMatch({ operator: '$in', value: '10, 12, 23' }).should.deep.eql(['10', '12', '23']);
    });

    it('should parse list of fields ($nin)', function() {
      parser.parseMatch({ operator: '$nin', value: '10, 12, 23' }).should.deep.eql(['10', '12', '23']);
    });

    it('should return raw value', function() {
      parser.parseMatch({ operator: '$gt', value: '10, 12, 23' }).should.eql('10, 12, 23');
    });
  });

});