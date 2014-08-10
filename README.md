# NOOT.js [![Build Status](https://travis-ci.org/planorama/noot.js.svg?branch=master)](https://travis-ci.org/planorama/noot.js)
**High quality, well tested, lightweight object oriented toolset for Node.js.**


## Installation
```shell
$ npm install noot --save
```


## Usage

#### General
```javascript
var NOOT = require('noot')(dependencies);
```

#### Requiring multiple NOOT modules
```javascript
// Require NOOT modules using an array of strings
var NOOT = require('noot')(['core-object', 'utils', 'logger', 'configurator']);

// Require NOOT modules using a list of strings
var NOOT = require('noot')('core-object', 'utils', 'logger', 'configurator');

// Require NOOT modules using a mix of strings and arrays
var NOOT = require('noot')('core-object', ['utils', ['logger']], 'configurator');


// All three previous methods will give you the same result, and attach to NOOT your desired modules :
NOOT.CoreObject;
NOOT.Utils;
NOOT.Logger;
NOOT.Configurator;
```

#### Accessing the NOOTManager
To access the NOOTManager, simply omit the `dependencies` argument.
```javascript
var NOOTManager = require('noot')();
```

#### Requiring a single NOOT module
If you wish to only access a single NOOT module without getting an object, use the `NOOTManager.require()` function.
```javascript
var Logger = NOOTManager.require('logger');
```


#### Naming convention
NOOT provides classes and namespaces, and uses camelCase convention. However, you can require NOOT modules using dasherized names.
```javascript
require('noot')('core-object');
// is equivalent to
require('noot')('CoreObject');
// is equivalent to
require('noot')('coreObject');
```


## Philosophy
NOOT is not a framework, it is a toolset designed to help developers starting projects with a common base of modules.


## Modules

### NOOT.CoreObject [Class]
Core piece of this toolset, all NOOT modules are based on this object factory. With an Ember/Backbone style implementation, it allows you to create classes using prototypal inheritance and has a cool `_super()` feature.

[Documentation and examples](lib/core-object/README.md)

### NOOT.Utils [Namespace]
Urls, strings, arrays, objects, dates... A bench of useful methods to deal with common situations.

[Documentation and examples](lib/utils/README.md)


