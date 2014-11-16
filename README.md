# NOOT.js [![Build Status](https://travis-ci.org/planorama/noot.js.svg?branch=master)](https://travis-ci.org/planorama/noot.js) [![Coverage Status](https://img.shields.io/coveralls/planorama/noot.js.svg)](https://coveralls.io/r/planorama/noot.js?branch=master) [![NPM version](https://badge.fury.io/js/noot.svg)](http://badge.fury.io/js/noot) [![Code Climate](https://codeclimate.com/github/planorama/noot.js/badges/gpa.svg)](https://codeclimate.com/github/planorama/noot.js) (under development)
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
var NOOT = require('noot')('object');

var Person = NOOT.Object.extend({
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

#### [NOOT.Object](src/core-object/README.md) *Class*
For now, same as NOOT.CoreObject. In the future, this class will implement compted properties.

#### [NOOT.Namespace](src/namespace/README.md) *Class*

#### [NOOT.Configurator](src/configurator/README.md) *Class*
Lightweight module to deal with environments configurations.

#### [NOOT.Logger](src/logger/README.md) *Class*
Simple logger that supports level configuration and custom/multiple transport methods.

#### [NOOT.Url](src/url/README.md) *Namespace*

#### [NOOT.Time](src/time/README.md) *Namespace*
Time related utils such as time constants.

#### [NOOT.CustomRequire](src/custom-require/README.md) *Factory*
Create a custom `require` function to avoid dealing with relative paths.

#### [NOOT.TasksRunner](src/tasks-runner/README.md) *Class*
Croned tasks for your applicaton and workers.



##License
Copyright (c) 2014 CDVM Solutions, released under the MIT license.