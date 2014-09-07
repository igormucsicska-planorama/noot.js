# NOOT.CustomRequire

Similar to the built-in `require` method except that the root folder and function name can be customized. Use this to avoid dealing with relative paths.


## Usage
```javascript
var NOOT = require('noot')('custom-require');

var rek = NOOT.CustomRequire.create({ name: 'rek', makeGlobal: true });
```

## Properties

### **name** *String*

If `makeGlobal` is true, `name` will be the name of the function attached to the global context.

### **makeGlobal** *Boolean*

Define whether or not you want the function to be global. Defaults to `false`.

### **root** *String*

Fully qualified (relative paths won't work) root directory to look into when requiring modules. Defaults to `process.cwd()`.

## Examples

#### Basic example

Let's say you have the following files tree :

```
	app.js
    app-modules
    	|____logger.js
    models
    	|____users.js
```

```javascript
// In app.js
var NOOT = require('noot')('custom-require');

NOOT.CustomRequire.create({
  name: 'apprequire',
  makeGlobal: true,
  root: path.resolve(__dirname, 'app-modules')
});


// In /models/users.js
var logger = apprequire('logger').

-> Here we are !
```