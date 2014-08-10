/**
 * Dependencies
 */
var path = require('path');


/**
 * Useful url related methods
 */
var Url = {};

/**
 * Constants
 */
var PROTOCOL_REG = /^http(s)?:\/\//;


/**
 * join
 *
 * Node path style join for urls, taking care of protocol and ensuring right slashes at the right place
 */
Url.join = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  var ret = args.join('/');
  var protocol = ret.match(PROTOCOL_REG);
  protocol = protocol ? protocol[0] : '';
  ret = ret.replace(protocol, '');
  if(protocol) ret = ret.replace(/^\/+/, '');
  return protocol + path.join(ret);
};

/**
 *
 *
 * @param url
 * @param useHTTPS
 */
Url.ensureProtocol = function(url, useHTTPS) {
  var forceProtocol = arguments[1] !== undefined;
  var protocol = url.match(PROTOCOL_REG);
  protocol = protocol ? protocol[0] : '';
  if(protocol) url = url.replace(protocol, '');
  else protocol = ['http', useHTTPS ? 's' : '', '://'].join('');
  if(useHTTPS) protocol = protocol.replace(/^http(s)?/, 'https');
  else if(forceProtocol) protocol = protocol.replace(/^http(s)?/, 'http');
  return Url.join(protocol, url);
};

/**
 * @exports
 */
module.exports = Url;