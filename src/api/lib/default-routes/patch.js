/**
 * Dependencies
 */
var Route = require('../route');

/***********************************************************************************************************************
 * @class Patch
 * @namespace NOOT.API.DefaultRoutes
 * @extends NOOT.API.Route
 * @constructor
 *
 **********************************************************************************************************************/
var Patch = Route.extend({

  method: 'patch',
  path: '/:id?',

  handler: function(req, res, next) {
    var self = this;
    return this.resource.patch(req, function(err, data) {
      if (err) return next(err);
      return self.resource.createResponse(res, data);
    });
  }

});

/**
 * @exports
 */
module.exports = Patch;