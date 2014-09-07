/**
 * Dependencies
 */
var path = require('path');
var NOOT = require('../../../')('namespace');


/***********************************************************************************************************************
 * NOOT.Utils.Url
 ***********************************************************************************************************************
 *
 *
 *
 *
 **********************************************************************************************************************/
var Url = NOOT.Namespace.create({
  PROTOCOL_REG: /^http(s)?:\/\//,

  /**
   *
   *
   * @returns {*}
   */
  join: function() {
    var args = Array.prototype.slice.call(arguments, 0);
    var ret = args.join('/');
    var protocol = ret.match(this.PROTOCOL_REG);
    protocol = protocol ? protocol[0] : '';
    ret = ret.replace(protocol, '');
    if (protocol) ret = ret.replace(/^\/+/, '');
    return protocol + path.join(ret);
  },

  /**
   *
   *
   * @param url
   * @param useHTTPS
   * @returns {*|string}
   */
  ensureProtocol: function(url, useHTTPS) {
    var forceProtocol = arguments[1] !== undefined;
    var protocol = url.match(this.PROTOCOL_REG);
    protocol = protocol ? protocol[0] : '';
    if (protocol) url = url.replace(protocol, '');
    else protocol = ['http', useHTTPS ? 's' : '', '://'].join('');
    if (useHTTPS) protocol = protocol.replace(/^http(s)?/, 'https');
    else if (forceProtocol) protocol = protocol.replace(/^http(s)?/, 'http');
    return Url.join(protocol, url);
  }

});

/**
 * @module
 */
module.exports = Url;