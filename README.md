# NOOT.js
Node.js Object Oriented Toolset




## Installation
```shell
$ npm install noot --save
```


## Usage
General
```javascript
var NOOT = require('noot')( /* Dependencies */ );
```
Require NOOT modules using an array of strings
```javascript
var NOOT = require('noot')(['core-object', 'utils', 'logger', 'configurator']);
```
Require NOOT modules using a list of strings
```javascript
var NOOT = require('noot')('core-object', 'utils', 'logger', 'configurator');
```
Require NOOT modules using a mix of strings and arrays
```javascript
var NOOT = require('noot')('core-object', ['utils', ['logger']], 'configurator');
```
All previous methods will give you the same result, a single object containing all the desired dependencies :
```javascript
{
  CoreObject: ...,
  Utils: ...,
  Logger: ...,
  Configurator: ...
}
```



## Modules

[NOOT.CoreObject](lib/core-object/README.md)
