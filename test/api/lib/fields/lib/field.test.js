/**
 * Dependencies
 */
var NOOT = nootrequire('api', 'enum');
var Field = NOOT.API.Field;


var STATES = NOOT.Enum.create({
  PENDING: 0,
  READY: 1,
  ARCHIVED: 2
});

var CustomField = Field.extend({
  path: 'st',
  publicPath: 'state',

  toPublic: function() {
    return STATES.getKey(this.value).toLowerCase();
  },

  toInternal: function() {
    return STATES[this.value.toUpperCase()];
  },

  validate: function() {
    if (!this._super()) return false;

    if (!NOOT.isString(this.value)) {
      return this.setValid(false, this.badTypeMessage('string'));
    }

    if (!STATES.hasKey(this.value.toUpperCase())) {
      return this.setValid(false, this.notInEnumMessage(STATES.keys));
    }

    return this.isValid;
  }
});


describe('NOOT.API.Field', function() {

  it('should be a valid value', function() {
    var field = CustomField.create({ value: 'archived' });
    field.validate();
    field.isValid.should.eql(true);
    field.messages.should.have.lengthOf(0);
  });

  it('should not be a valid value', function() {
    var field = CustomField.create({ value: 'foo' });
    field.validate();
    field.isValid.should.eql(false);
    field.messages.should.have.lengthOf(1);
  });

  it('should return an enum\'s key', function() {
    var field = CustomField.create({ value: STATES.PENDING });
    field.toPublic().should.equal('pending');
  });

  it('should return an enum\'s value', function() {
    var field = CustomField.create({ value: 'ready' });
    field.toInternal().should.equal(STATES.READY);
  });

});