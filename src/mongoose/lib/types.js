/**
 * Dependencies
 */
var mongooseTypes = require('mongoose-types');
var NOOT = require('../../../')('namespace');


var Types = NOOT.Namespace.create({
  Email: mongooseTypes.Email,
  Url: mongooseTypes.Url
});


/**
 * @module
 */
module.exports = Types;