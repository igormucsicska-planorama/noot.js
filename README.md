# NOOT.js [![Build Status](https://travis-ci.org/planorama/noot.js.svg?branch=master)](https://travis-ci.org/planorama/noot.js) [![Coverage Status](https://img.shields.io/coveralls/planorama/noot.js.svg)](https://coveralls.io/r/planorama/noot.js?branch=master) [![NPM version](https://badge.fury.io/js/noot.svg)](http://badge.fury.io/js/noot) [![Code Climate](https://codeclimate.com/github/planorama/noot.js/badges/gpa.svg)](https://codeclimate.com/github/planorama/noot.js) (under development)
**Robust, well tested, lightweight object oriented toolset for Node.js.**


## Installation
```shell
$ npm install noot --save
```

## Philosophy
NOOT is not a framework, it is a toolset designed to help developers starting projects with a common base of modules.


## Recent news
NOOT@0.6.0 has just been released and contains a bunch a new modules, such as :
- NOOT.API : a tastypie like, storage agnostic APIs manager
- NOOT.Enum : simple modle to deal with enumerations
- NOOT.HTTP : enumeration of existing HTTP codes to make their usage more human friendly
- NOOT.Mixin : a simple implementation of mixins behavior
- NOOT.Mixins : namespace to contain various useful mixins
- Lot of new utils and

## Production usage
All modules except NOOT.API are fully tested can be used in production. We're in the process of testing and improving the APIs module in our own systems and won't recommend it to be used before we are absolutely happy with the implementation.

## Usage

#### General
```javascript
var NOOT = require('noot')(dependencies);
```

#### Requiring multiple NOOT modules
```javascript
// Require NOOT modules using an array of strings
var NOOT = require('noot')(['core-object', 'url', 'logger', 'configurator']);

// Require NOOT modules using a list of strings
var NOOT = require('noot')('core-object', 'url', 'logger', 'configurator');

// Require NOOT modules using a mix of strings and arrays
var NOOT = require('noot')('core-object', ['url', ['logger']], 'configurator');


// All three previous methods will give you the exact same result, and attach to NOOT your desired modules :
NOOT.CoreObject;
NOOT.Url;
NOOT.Logger;
NOOT.Configurator;
```

#### Naming convention
NOOT provides classes and namespaces, and uses PascalCase convention. However, you can require NOOT modules using dasherized or camelCased names.
```javascript
require('noot')('core-object');
// is equivalent to
require('noot')('CoreObject');
// is equivalent to
require('noot')('coreObject');
```


#### Useful methods
In addition to modules, NOOT also provides several useful methods such as custom `typeOf`, jQuery's style `makeArray`... Complete list and documentation to be found [here](src/noot/utils/README.md). Those methods are directly attached to the NOOT namespace :

```javascript
var NOOT = require('noot')();

NOOT.isString('foo'); // true
NOOT.makeReadOnly({}, 'foo', 'bar');
...
```


## Documentation