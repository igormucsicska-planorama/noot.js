var NOOT = require('../../../')();

var Resource = require('./resource');


var S3Resource = Resource.extend({


  _defineFields: function() {

  },


  /**
   *
   *
   *
   * @param {NOOT.API.Stack} stack
   */
  get: function(stack) {

  },

  /**
   *
   *
   *
   * @param {NOOT.API.Stack} stack
   */
  getMany: function(stack) {
    var self = this;
    var query = stack.query;
    return this.model
      .find(query.match, query.select)
      .sort(query.sort)
      .offset(query.offset)
      .limit(query.limit)
      .exec(function(err, items) {
        if (err) return stack.next(err);
        return self.getCount(query.match, function(err, count) {
          if (err) return stack.next(err);
          return stack.computeManyMeta(count).setData(items).setStatus(NOOT.HTTP.OK).next();
        });
      });
  },

  create: function(stack) {
    var isMulti = NOOT.isArray(stack.body);

    if (isMulti && !_.contains(this.manyMethods, 'post')) {
      return stack.next(new NOOT.Errors.Forbidden('Cannot `post` multiple items'));
    }

    return this.model.create(stack.req.body, function(err, items) {
      if (err) return stack.next(err);
      return stack.setData(items).setStatus(NOOT.HTTP.Created).next();
    });
  }


});


module.exports = S3Resource;