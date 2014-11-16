var NOOT = require('../../../../');

var ALLOWED_TIMINGS = ['createdOn', 'updatedOn'];

var useTimestamps = function(schema, timings) {
  if (!timings) timings = ALLOWED_TIMINGS.slice(0);
  if (!Array.isArray(timings)) timings = [timings];

  var invalid = timings.filter(function(timing) { return !~ALLOWED_TIMINGS.indexOf(timing); });
  if (invalid.length) throw new Error('Invalid timings ' + invalid.join(', '));

  var paths = {};
  timings.forEach(function(timing) {
    paths[timing] = { type: Date };
  });

  schema.add(paths);

  console.log(schema);

  schema.pre('save', function(next) {
    var now = new Date();

    if (!this.createdOn) this.createdOn = now;
    if (!this.updatedOn) this.updatedOn = now;

    if (this.isModified) this.updatedOn = now;

    console.log(this);

    return next();
  });


  return schema;
};


/**
 *
 * @type {useTimestamps}
 */
module.exports = useTimestamps;