/**
 * Dependencies
 */
var Route = require('../route');

/***********************************************************************************************************************
 * @class Get
 * @namespace NOOT.API.DefaultRoutes
 * @extends NOOT.API.Route
 * @constructor
 *
 **********************************************************************************************************************/
var Get = Route.extend({

  method: 'get',
  path: '/:id?',

  handler: function(req, res, next) {
    var self = this;
    return this.resource.get(req, function(err, data) {
      if (err) return next(err);
      return self.resource.createResponse(res, data);
    });
  }

});

/**
 * @exports
 */
module.exports = Get;