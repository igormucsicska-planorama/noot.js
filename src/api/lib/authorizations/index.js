/**
 * Dependencies
 */
var NOOT = require('../../../../')('namespace');

var Authorization = require('./lib/authorization');

/***********************************************************************************************************************
 *
 *
 *
 *
 **********************************************************************************************************************/
var Authorizations = NOOT.Namespace.create({

  Authorization: Authorization

});


/**
 * @exports
 */
module.exports = Authorizations;