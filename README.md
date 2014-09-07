# NOOT.js [![Build Status](https://travis-ci.org/planorama/noot.js.svg?branch=master)](https://travis-ci.org/planorama/noot.js) [![Coverage Status](https://img.shields.io/coveralls/planorama/noot.js.svg)](https://coveralls.io/r/planorama/noot.js?branch=master) (under development)
**High quality, well tested, lightweight object oriented toolset for Node.js.**


## Installation
```shell
$ npm install noot --save
```

## Philosophy
NOOT is not a framework, it is a toolset designed to help developers starting projects with a common base of modules.


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


// All three previous methods will give you the exact same result, and attach to NOOT your desired modules :
NOOT.CoreObject;
NOOT.Utils;
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
var NOOT = require('noot')('core-object');

var Person = NOOT.CoreObject.extend({
  firstName: null,
  init: function() {
    if (NOOT.isString(this.firstName)) console.log('Hi, my name is', this.firstName);
  }
});
```

## Modules

#### [NOOT](src/noot/utils/README.md) *Namespace*
Main Noot namespace.

#### [NOOT.CoreObject](src/core-object/README.md) *Class*
Core piece of this toolset, all NOOT modules are based on this object factory. With an Ember/Backbone style implementation, it allows you to create classes using prototypal inheritance and has a cool `_super()` feature.

#### [NOOT.Configurator](src/configurator/README.md) *Class*
Lightweight module to deal with environments configurations.

#### [NOOT.Logger](src/logger/README.md) *Class*
Simple logger that supports level configuration and custom/multiple transport methods.

#### [NOOT.Utils](src/utils/README.md) *Namespace*
Urls, strings, arrays, objects, dates... Tons of useful methods to deal with recurrent needs.


##License
Copyright (c) 2014 CDVM Solutions, released under the MIT license.