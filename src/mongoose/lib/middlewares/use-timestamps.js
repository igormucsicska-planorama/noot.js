/***********************************************************************************************************************
 * useTimestamps
 ***********************************************************************************************************************
 *
 *
 *
 *
 **********************************************************************************************************************/
var useTimestamps = function(schema) {
  schema.add({ createdOn: Date });
  schema.add({ updatedOn: Date });

  schema.pre('save', function(next) {
    var now = new Date();

    if (!this.createdOn) this.createdOn = this.updatedOn = now;
    else if (this.isModified()) this.updatedOn = now;

    return next();
  });

  return schema;
};


/**
 * @module
 */
module.exports = useTimestamps;