var NOOT = nootrequire('api');


describe('NOOT.API.MessagesProvider', function() {

  var messagesProvider = NOOT.API.MessagesProvider.create();

  describe('.prototype.defaultInternalServerError()', function() {
    it('should return right message', function() {
      messagesProvider.defaultInternalServerError()
        .should.eql('An unexpected error has occurred, please try again later.');
    });
  });

  describe('.prototype.missingParameter()', function() {
    it('should return right message', function() {
      messagesProvider.missingParameter('foo').should.eql([
        messagesProvider.highlight('foo'),
        'is required.'
      ].join(' '));
    });
  });

  describe('.prototype.notInEnum()', function() {
    it('should return right message', function() {
      messagesProvider.notInEnum('prop', ['bar', 'baz'], 'foo').should.eql([
        messagesProvider.highlight('prop'),
        'should be in:',
        messagesProvider.highlight(['bar', 'baz'].join(', ')),
        '- instead got',
        messagesProvider.highlight('foo') + '.'
      ].join(' '));
    });
  });

  describe('.prototype.badType()', function() {
    it('should return right message', function() {
      messagesProvider.badType('foo', 'number', 'string').should.eql([
        messagesProvider.highlight('foo'),
        'should be a',
        messagesProvider.highlight('number'),
        '- instead go a',
        messagesProvider.highlight('string') + '.'
      ].join(' '));
    });
  });

  describe('.prototype.forbiddenOperator()', function() {
    it('should return right message', function() {
      messagesProvider.forbiddenOperator('foo', 'in').should.eql([
        'Operator',
        messagesProvider.highlight('in'),
        'is not allowed for property',
        messagesProvider.highlight('foo') + '.'
      ].join(' '));
    });
  });

  describe('.prototype.unsupportedOperator()', function() {
    it('should return right message', function() {
      messagesProvider.unsupportedOperator('in').should.eql([
        'Operator',
        'in',
        'is not supported.'
      ].join(' '));
    });
  });

  describe('.prototype.forbiddenField()', function() {
    it('should return right message', function() {
      messagesProvider.forbiddenField('foo').should.eql([
        'Field',
        messagesProvider.highlight('foo'),
        'is not allowed or does not exist.'
      ].join(' '));
    });
    it('should return right message with verb', function() {
      messagesProvider.forbiddenField('foo', 'select').should.eql([
        'Cannot',
        'select',
        'field',
        messagesProvider.highlight('foo') + '.'
      ].join(' '));
    });
  });

  describe('.prototype.unsupportedResponseType()', function() {
    it('should return right message', function() {
      messagesProvider.unsupportedResponseType('xml').should.eql([
        'Response type',
        messagesProvider.highlight('xml'),
        'is not supported.'
      ].join(' '));
    });
  });

});