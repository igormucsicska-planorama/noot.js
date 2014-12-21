var NOOT = require('../../../')();
var Cache = require('./cache');

var Expirable = Cache.extend({

  duration: null,
  _validUntil: 0,

  init: function() {
    this._super();
    NOOT.required(this, 'duration');

    var self = this;

    Object.defineProperty(this.target, this.name, {
      get: function() {
        if (self._isValid()) return self._value;
        self._setValidUntil();
        var args = [];
        if (self._isAsync) {
          args.push(function(err, value) {
            if (err) throw err;
            self._value = value;
          });
          self.update.apply(self.target, args);
        } else {
          self._value = self.update.apply(self.target, args);
        }
        return self._value;
      }
    });
  },

  _isValid: function() {
    return this._validUntil >= Date.now();
  },

  _setValidUntil: function() {
    this._validUntil = Date.now() + this.duration;
  }

});

module.exports = Expirable;