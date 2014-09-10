/**
 * Dependencies
 */
var path = require('path');
var NOOT = require('../../')('namespace');


/***********************************************************************************************************************
 * NOOT.Utils.Url
 ***********************************************************************************************************************
 *
 *
 *
 *
 **********************************************************************************************************************/
var Url = NOOT.Namespace.create({
  PROTOCOL_REG: /^(file:\/|(http(s)?|s?ftp|smb):)(\/){2}/i,
  HTTP_PROTOCOL_REG: /^http(s)?:\/{2}/i,

  /**
   * join
   *
   * parts {...String}
   * @returns {String}
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
   * ensureHTTPProtocol
   *
   * @param {String} url
   * @param {Boolean} [useHTTPS]
   * @returns {String}
   */
  ensureHTTPProtocol: function(url, useHTTPS) {
    var forceProtocol = useHTTPS !== undefined;
    var protocol = url.match(this.HTTP_PROTOCOL_REG);
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