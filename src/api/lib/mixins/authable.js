var NOOT = require('../../../../')('mixin');

var Authentication = require('../authentications').Authentication;
var Authorization = require('../authorizations').Authorization;

var Authable = NOOT.Mixin.create({
  _authentication: null,
  get authentication() { return this._authentication; },
  set authentication(value) {
    if (!Authentication.detect(value)) throw new Error('Must be a subclass of NOOT.API.Authentication');
    this._authentication = value;
  },

  _authorization: null,
  get authorization() { return this._authentication; },
  set authorization(value) {
    if (!Authorization.detect(value)) throw new Error('Must be a subclass of NOOT.API.Authorization');
    this._authorization = value;
  }
});

module.exports = Authable;