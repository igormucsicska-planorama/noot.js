/**
 * Dependencies
 */
var NOOT = require('../../../../index')('errors', 'http', 'mixin');
var Inflector = require('inflected');
var _ = require('lodash');

var Utils = require('./../utils');


/***********************************************************************************************************************
 * Groups all configurable properties for NOOT.API.Resource, NOOT.API.Route and NOOT.API.Stack. Most properties are
 * "bubbleable", meaning that an instance implementing this mixin will inherit the values from their `__queryableParent`
 * An instance tat would not have a `__queryableParent` will be considered as "root" and take the default values from
 * `BUBBLED_PROPERTIES_DEFAULTS`.
 *
 * @class Queryable
 * @namespace NOOT.API
 * @extends NOOT.Mixin
 * @static
 **********************************************************************************************************************/
var Queryable = NOOT.Mixin.create({

  /**
   * Instance's parent, from which properties will be bubbled. If not defined, the instance is considered as root and
   * inherits from default values in `BUBBLED_PROPERTIES_DEFAULTS`.
   *
   * @property __queryableParent
   * @type Object
   * @private
   */
  __queryableParent: null,

  /**
   * List of selectable fields.
   *
   * @property selectable
   * @type Array of String
   * @default []
   */
  selectable: null,

  /**
   * List of non selectable fields.
   *
   * @property selectable
   * @type Array of String
   * @default []
   */
  nonSelectable: null,

  /**
   * Private version of `selectable`, used for bubbling.
   *
   * @property _selectable
   * @type Array
   * @private
   */
  _selectable: null,

  /**
   * List of writable fields.
   *
   * @property writable
   * @type Array of String
   * @default []
   */
  writable: null,

  /**
   * List of non writable fields.
   *
   * @property nonWritable
   * @type Array of String
   * @default []
   */
  nonWritable: null,

  /**
   * Private version of `writable`, used for bubbling.
   *
   * @property _writable
   * @type Array
   * @private
   */
  _writable: null,

  /**
   * List of sortable fields.
   *
   * @property sortable
   * @type Array of String
   * @default []
   */
  sortable: null,

  /**
   * List of non sortable fields.
   *
   * @property nonSortable
   * @type Array of String
   * @default []
   */
  nonSortable: null,

  /**
   * Private version of `sortable`, used for bubbling.
   *
   * @property _sortable
   * @type Array
   * @private
   */
  _sortable: null,

  /**
   * List of filterable fields.
   *
   * @property filterable
   * @type Array of String
   * @default []
   */
  filterable: null,

  /**
   * List of non filterable fields.
   *
   * @property nonFilterable
   * @type Array of String
   * @default []
   */
  nonFilterable: null,

  /**
   * Private version of `filterable`, used for bubbling.
   *
   * @property _filterable
   * @type Array
   * @private
   */
  _filterable: null,

  /**
   * Maximum limit allowed for GET requests.
   *
   * @property maxGetLimit
   * @type Number
   * @default 100
   */
  maxGetLimit: null,

  /**
   * Private version of `maxGetLimit`, used for bubbling.
   *
   * @property _maxGetLimit
   * @type Number
   * @private
   */
  _maxGetLimit: null,

  /**
   * Default limit for GET requests.
   *
   * @property defaultGetLimit
   * @type Number
   * @default: 20
   */
  defaultGetLimit: null,

  /**
   * Private version of `defaultGetLimit`, used for bubbling.
   *
   * @property _defaultGetLimit
   * @type Number
   * @private
   */
  _defaultGetLimit: null,

  /**
   * Separator for operators in query strings. Ie "age__gt=5" will be parsed as "age: { gt: 5 }".
   *
   * @property operatorSeparator
   * @type String
   * @default __
   */
  operatorSeparator: null,

  /**
   * Private version of `operatorSeparator`, used for bubbling.
   *
   * @property _operatorSeparator
   * @type String
   * @private
   */
  _operatorSeparator: null,

  /**
   * List of all available fields, will generally by provided by the root instance.
   *
   * @property fieldsPaths
   * @type Array of String
   * @default []
   */
  fieldsPaths: null,

  /**
   * Private version of `fieldsPaths`, used for bubbling.
   *
   * @property _fieldsPaths
   * @type Array of String
   * @private
   */
  _fieldsPaths: null,

  /**
   * Computes mixin's properties. Has to be called on instance, usually in the constructor.
   *
   * @method computeQueryable
   * @chainable
   */
  computeQueryable: function() {
    this._buildBubbledFields();
    return this;
  },

  /**
   * In charge of building all bubbled properties.
   *
   * @method _buildBubbledFields
   * @private
   */
  _buildBubbledFields: function() {
    ['selectable', 'sortable', 'writable', 'filterable']
      .forEach(this._buildAllowedFieldsForType.bind(this));

    ['maxGetLimit', 'defaultGetLimit', 'operatorSeparator', 'fieldsPaths']
      .forEach(this._defineBubbledProperty.bind(this));
  },

  /**
   * In charge of building allowed fields for a given type using both positive and negative properties. For example,
   * final `selectable` value is based on both `selectable` and `nonSelectable`.
   *
   * @method _buildAllowedFieldsForType
   * @param {String} type
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
   * Defines a bubbled property as read only.
   *
   * @method _defineBubbledProperty
   * @param {String} prop
   * @private
   */
  _defineBubbledProperty: function(prop) {
    return Object.defineProperty(this, prop, {
      get: function() { return this._bubbleProperty('_' + prop, prop); }
    });
  },

  /**
   * Bubbles a property on `__queryableParent`.
   *
   * @method _bubbleProperty
   * @param {String} propertyName
   * @param {String} bubblingKey
   * @return {*}
   * @private
   */
  _bubbleProperty: function(propertyName, bubblingKey) {
    return Utils.bubbleProperty(this, '__queryableParent', propertyName, {
      default: this.BUBBLED_PROPERTIES_DEFAULTS[propertyName],
      bubblingKey: bubblingKey
    });
  },

  /**
   * Default values for bubbled properties.
   *
   * @property BUBBLED_PROPERTIES_DEFAULTS
   * @type Object
   * @final
   */
  BUBBLED_PROPERTIES_DEFAULTS: {
    get _selectable() { return []; },
    get _writable() { return []; },
    get _sortable() { return []; },
    get _filterable() { return []; },
    get _maxGetLimit() { return 100; },
    get _defaultGetLimit() { return 20; },
    get _operatorSeparator() { return '__'; },
    get _fieldsPaths() { return []; }
  }

});


/**
 * @exports
 */
module.exports = Queryable;
