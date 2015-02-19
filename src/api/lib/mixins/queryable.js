/**
 * Dependencies
 */
var NOOT = require('../../../../index')('errors', 'http', 'mixin');
var Inflector = require('inflected');
var _ = require('lodash');


var Utils = require('./../utils');

/**
 * Defaults values for bubbled properties
 */
var BUBBLED_PROPERTIES_DEFAULTS = {
  get _selectable() { return []; },
  get _writable() { return []; },
  get _sortable() { return []; },
  get _filterable() { return []; },
  get _maxGetLimit() { return 100; },
  get _defaultGetLimit() { return 20; },
  get _operatorSeparator() { return '__'; }
};


/***********************************************************************************************************************
 * @class Queryable
 * @namespace NOOT.API
 * @extends NOOT.Mixin
 * @static
 **********************************************************************************************************************/
var Queryable = NOOT.Mixin.create({

  /**
   * @property _queryableParent
   * @type Object
   * @private
   */
  __queryableParent: null,

  selectable: null,
  nonSelectable: null,
  _selectable: null,

  writable: null,
  nonWritable: null,
  _writable: null,

  sortable: null,
  nonSortable: null,
  _sortable: null,

  filterable: null,
  nonFilterable: null,
  _filterable: null,

  maxGetLimit: null,
  _maxGetLimit: null,

  defaultGetLimit: null,
  _defaultGetLimit: null,

  operatorSeparator: null,
  _operatorSeparator: null,

  fieldsPaths: null,

  /**
   *
   *
   * @chainable
   */
  computeQueryable: function() {
    this._buildBubbledFields();
    return this;
  },

  /**
   *
   *
   *
   * @private
   */
  _buildBubbledFields: function() {
    ['selectable', 'sortable', 'writable', 'filterable'].forEach(this._buildAllowedFieldsForType.bind(this));
    ['maxGetLimit', 'defaultGetLimit', 'operatorSeparator'].forEach(this._defineBubbledProperty.bind(this));
  },

  /**
   *
   *
   *
   * @param type
   * @private
   */
  _buildAllowedFieldsForType: function(type) {
    var allowed = this[type];
    var disallowed = this['non' + Inflector.classify(type)];

    if (!allowed) {
      if (!this.__queryableParent) allowed = this.fieldsPaths;
      else allowed = this.__queryableParent[type];
    }

    if (disallowed) {
      if (!allowed) allowed = this.fieldsPaths;
      allowed = allowed.filter(function(field) { return !~disallowed.indexOf(field); });
    }

    if (type !== 'selectable' && this.selectable) {
      allowed = _.intersection(allowed, this.selectable);
    }

    this['_' + type] = allowed;

    return this._defineBubbledProperty(type);
  },

  /**
   *
   *
   *
   * @param prop
   * @private
   */
  _defineBubbledProperty: function(prop) {
    return Object.defineProperty(this, prop, {
      get: function() { return this._bubbleProperty('_' + prop, prop); }
    });
  },

  /**
   *
   *
   * @method _bubbleProperty
   * @param {String} propertyName
   * @param {String} bubblingKey
   * @return {*}
   * @private
   */
  _bubbleProperty: function(propertyName, bubblingKey) {
    return Utils.bubbleProperty(this, '__queryableParent', propertyName, {
      default: BUBBLED_PROPERTIES_DEFAULTS[propertyName],
      bubblingKey: bubblingKey
    });
  }

});


module.exports = Queryable;
