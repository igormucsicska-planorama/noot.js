/**
 * Dependencies
 */
var NOOT = require('../../../../')('namespace');

var Authentication = require('./lib/authentication');

/***********************************************************************************************************************
 *
 *
 *
 *
 **********************************************************************************************************************/
var Authentications = NOOT.Namespace.create({
  Authentication: Authentication
});


/**
 * @exports
 */
module.exports = Authentications;