/**
 * Dependencies
 */
var NOOT = require('../../../')('object');
var _ = require('lodash');


/***********************************************************************************************************************
 * CountCache
 ***********************************************************************************************************************
 *
 * @format : { filter: Object, validUntil: Time, value: Number }
 *
 *
 **********************************************************************************************************************/
var CountCache = NOOT.Object.extend({

  model: null,
  expiration: null,

  _values: null,

  init: function() {
    NOOT.required(this, 'model', 'expiration');
    this._values = [];
  },

  /**
   * Get count for a given filter, returning either a cached value or fetching a new one
   *
   * @param filter
   * @param callback
   * @returns {*}
   */
  getCount: function(filter, callback) {
    var existing = _.pull(this._values, function(item) {
      return _.isEqual(filter, item.filter);
    });

    if (existing && existing.validUntil >= Date.now()) {
      this._values.unshift(existing);
      return callback(null, existing.value);
    } else {
      var self = this;
      return this.model.count(filter, function(err, count) {
        if (err) return callback(err);
        self._values.push({
          filter: filter,
          validUntil: Date.now() + self.expiration,
          value: count
        });
        return callback(null, count);
      });
    }
  }

});


/**
 * @module
 */
module.exports = CountCache;