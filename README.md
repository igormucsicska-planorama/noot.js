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
In addition to modules, NOOT also provides several useful methods such as custom `typeOf`, jQuery's style `makeArray`... Complete list documentation to be found [here](src/noot/README-utils.md). Those methods are directly attached to the NOOT namespace :

```javascript
var NOOT = require('noot')('logger');

var logger = NOOT.Logger.extend({
  list: function() {
    var args = NOOT.makeArray(arguments);
    return this.writeLog(args.join('\n'));
  }
});
```

## Modules

#### NOOT.CoreObject *Class*
Core piece of this toolset, all NOOT modules are based on this object factory. With an Ember/Backbone style implementation, it allows you to create classes using prototypal inheritance and has a cool `_super()` feature.

[Documentation and examples](src/core-object/README.md)

#### NOOT.Utils *Namespace*
Urls, strings, arrays, objects, dates... Tons of useful methods to deal with recurrent needs.

[Documentation and examples](src/utils/README.md)


##License
Copyright (c) 2014 CDVM Solutions, released under the MIT license.