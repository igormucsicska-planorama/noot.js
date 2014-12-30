/**
 * Dependencies
 */
var Route = require('../route');

/***********************************************************************************************************************
 * @class Delete
 * @namespace NOOT.API.DefaultRoutes
 * @extends NOOT.API.Route
 * @constructor
 **********************************************************************************************************************/
var Delete = Route.extend({

  /**
   * @property method
   * @default delete
   * @type String
   */
  method: 'delete',

  /**
   * @property path
   * @default /:id
   * @type String
   */
  path: '/:id',

  /**
   * @property handler
   * @type middleware
   */
  handler: function(req, res, next) {
    var self = this;
    return this.resource.delete(req, function(err, data) {
      if (err) return next(err);
      return self.resource.createResponse(res, data);
    });
  }

});

/**
 * @exports
 */
module.exports = Delete;