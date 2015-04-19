/**
 * Dependencies
 */
var NOOT = require('../../../')('mixin');

/***********************************************************************************************************************
 * @class Registerable
 * @static
 * @extends NOOT.Mixin
 * @namespace NOOT.Mixins
 **********************************************************************************************************************/
var Registerable = NOOT.Mixin.create({

  /**
   * Safely register a new property in the class/namespace. If a property with the same name already exists, an error
   * will be thrown.
   *
   * @method register
   * @param {String} name
   * @param {*} value
   * @chainable
   */
  register: function(name, value) {
    if (arguments.length < 2) throw new Error('Not enough arguments');
    if (this.hasOwnProperty(name)) throw new Error('Cannot override `' + name + '`');
    this[name] = value;
    return this;
  }

});

/**
 * @exports
 */
module.exports = Registerable;