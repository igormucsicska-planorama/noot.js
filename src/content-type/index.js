/**
 * Dependencies
 */
var path = require('path');
var _ = require('lodash');
var NOOT = require('../../')('namespace');

var MAP = require('./lib/map');
var DEFAULT_CONTENT_TYPE = 'application/octet-stream';
var DEFAULT_EXTENSION = '';


/***********************************************************************************************************************
 * ContentType
 ***********************************************************************************************************************
 *
 *
 *
 *
 **********************************************************************************************************************/
var ContentType = NOOT.Namespace.create({

  /**
   * Get content type from extension
   *
   * @param {String} extension
   * @returns {String}
   */
  fromExtension: function(extension) {
    extension = extension.replace(/\./g, '');
    return MAP[extension.toLowerCase()] || DEFAULT_CONTENT_TYPE;
  },

  /**
   * Get content type from path
   *
   * @param {String} str
   * @returns {String}
   */
  fromPath: function(str) {
    return this.fromExtension(path.extname(str).toString());
  },

  /**
   * Get extension from content type
   *
   * @param {String} contentType
   * @returns {String}
   */
  toExtension: function(contentType) {
    return _.findKey(MAP, function(val) { return val === contentType; }) || DEFAULT_EXTENSION;
  }
});


/**
 * @module
 */
module.exports = ContentType;