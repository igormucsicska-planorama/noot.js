# NOOT.js
Node.js Object Oriented Toolset




### Installation
```shell
$ npm install noot --save
```


### Usage
```javascript
var NOOT = require('noot')( /* Dependencies */ );
```
Dependencies list as an array of strings
```javascript
var NOOT = require('noot')(['core-object', 'utils', 'logger']);
```
Dependencies list as an list of strings
```javascript
var NOOT = require('noot')('core-object', 'utils', 'logger');
```
Dependencies list as a mix of strings and arrays
```javascript
var NOOT = require('noot')('core-object', ['utils', 'logger'], 'configurator');
```



### Modules

[NOOT.CoreObject](lib/core-object/README.md)