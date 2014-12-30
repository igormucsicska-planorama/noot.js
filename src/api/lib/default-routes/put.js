/**
 * Dependencies
 */
var Route = require('../route');

/***********************************************************************************************************************
 * @class Put
 * @namespace NOOT.API.DefaultRoutes
 * @extends NOOT.API.Route
 * @constructor
 *
 **********************************************************************************************************************/
var Put = Route.extend({

  method: 'put',
  path: '/:id',

  handler: function(req, res, next) {
    var self = this;
    return this.resource.put(req, function(err, data) {
      if (err) return next(err);
      return self.resource.createResponse(res, data);
    });
  }

});

/**
 * @exports
 */
module.exports = Put;