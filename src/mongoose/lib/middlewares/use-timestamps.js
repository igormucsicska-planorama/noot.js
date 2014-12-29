
var CREATED_ON = 'createdOn';
var UPDATED_ON = 'updatedOn';

/***********************************************************************************************************************
 * @for NOOT.Mongoose
 * @method useTimestamps
 * @static
 **********************************************************************************************************************/
var useTimestamps = function(schema, options) {
  options = options || {};

  var createdOn = options.createdOn || CREATED_ON;
  var updatedOn = options.updatedOn || UPDATED_ON;

  var createdOnProperty = {};
  createdOnProperty[createdOn] = Date;

  var updatedOnProperty = {};
  updatedOnProperty[updatedOn] = Date;

  schema.add(createdOnProperty);
  schema.add(updatedOnProperty);

  schema.pre('save', function(next) {
    var now = new Date();

    if (!this.get(createdOn)) {
      this.set(createdOn, now);
      this.set(updatedOn, now);
    } else if (this.isModified()) {
      this.set(updatedOn, now);
    }

    return next();
  });

  return schema;
};


/**
 * @exports
 */
module.exports = useTimestamps;