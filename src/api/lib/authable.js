var Utils = require('./utils');

var Authable = {
  authentication: null,
  getAuthentication: function() { return Utils.bubbleProperty(this, 'authentication'); },

  authorization: null,
  getAuthorization: function() { return Utils.bubbleProperty(this, 'authorization'); }
};

module.exports = Authable;