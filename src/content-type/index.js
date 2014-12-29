/**
 * Dependencies
 */
var path = require('path');
var _ = require('lodash');
var NOOT = require('../../')('namespace');

var MAP = require('./lib/map');
var DEFAULT_CONTENT_TYPE = 'application/octet-stream';
var DEFAULT_EXTENSION = '';


/**
 * Deal with MIME types and files extensions
 *
 * @namespace NOOT
 * @class ContentType
 * @extends NOOT.Namespace
 * @static
 */
var ContentType = NOOT.Namespace.create({

  /**
   * Get content type from extension
   *
   * @method fromExtension
   * @static
   * @param {String} extension
   * @return {String}
   */
  fromExtension: function(extension) {
    extension = extension.replace(/\./g, '');
    return MAP[extension.toLowerCase()] || DEFAULT_CONTENT_TYPE;
  },

  /**
   * Get content type from path
   *
   * @method fromPath
   * @static
   * @param {String} str
   * @return {String}
   */
  fromPath: function(str) {
    return this.fromExtension(path.extname(str).toString());
  },

  /**
   * Get extension from content type
   *
   * @method toExtension
   * @static
   * @param {String} contentType
   * @returns {String}
   */
  toExtension: function(contentType) {
    return _.findKey(MAP, function(val) { return val === contentType; }) || DEFAULT_EXTENSION;
  }
});


/**
 * @exports
 */
module.exports = ContentType;