# NOOT.Logger

Simple logger that supports level configuration and custom/multiple transport methods.


## Usage
```javascript
var NOOT = require('noot')('logger');

var logger = NOOT.Logger.create({ level: /* mandatory logging level */ });
```


## Logging methods
### Methods list
**trace**

Most fine-grained informationnal events.

**debug**

Fine-grained informationnal events to debug your application.

**info**

High level information.

**warn**

Application warnings.

**error**

Application errors.

**announce**

Application level announcements, such as `Server started`, `Connected to DB`...

**highlight** 

Useful for logging particular events and be able to easily see them. Should only be used in particular cases when you need to *intercept* some information.


**IMPORTANT** The only way to shut down `announce` and `highlight` logs is to set `level` to `off`.

### Arguments
All logging methods accept any type of values.

- `null` and `undefined` will respectivly give `'null'` and `'undefined'`
- `boolean`, `string` and `number` will be transformed to their `toString()` value
- `Error` instances will be logged with their stack trace
- All other types will be logged using built-in `util.inspect(...)`

You can pass as many arguments as you want to the debugging methods. They will all be concatenated with a space between each.


## Properties

### **level** *String*

Logging level. Can be `trace`, `debug`, `info`, `warn`, `error`, `off`.

- Setting `off` will shut down all logs.
- Setting `info` will log `info` and all upper level logs : `info`, `warn`, `error`


### **shouldStyle** *Boolean*

Define whether or not logs should be styled. Defaults to `true`.

### **transportCallback** *(err)*

Callback to be passed to the `transport` method, to deal with async transports. Defaults to `NOOT.noop`.

### **formatMessage** String *(message, level)*
All logs will pass in this function before being transported. This method is called after the messages are concatenated but before they are styled.

#### Parameters
- **message** *String*

	Concatenation of all arguments passed to the logging method.

- **level** *String*

	Logging method level. Can be `trace`, `debug`, `info`, `warn`, `error`, `announce` or `highlight`.
    
#### Returns

By default, simply returns `message`. Customize this method and make it return what you need.


### **transport** *(message, level, transportCallback)*

Here we send the logs where we want. By default, simply uses `console.log`.

#### Parameters
- **message** *String*

	The string previously returned by `formatMessage`.
    
- **level** *String*

	Logging method level. Can be `trace`, `debug`, `info`, `warn`, `error`, `announce` or `highlight`.
    
- **transportCallback** *(err)*

	Logger's `transportCallback` property.
    
### **setStyles** *(styles)*

Define styles for each debugging method.

#### Parameters
- **styles** *Object*

	An object containing style definition for logging method(s) :
    ```javascript
    logger.setStyles({
      trace: 'grey',
      announce: { underline: true, color: 'cyan' }
    });
    ```
    
    If you only need to set the color property, you can simply provide its name. Otherwise, you can configure you styles with the available style keys.
    
    Note that the options you pass will be merged with NOOT.Logger default style options. For example, `announce` has the following style default configuration :
    ```javascript
    {
      announce: { bold: true, color: 'cyan' }
    }
    ```
    
    To remove the `bold` behavior, you'll have to set `announce` style like the following :
    ```javascript
    logger.setStyles({ announce: { bold: false } });
    // 'announce' logs will now be printed in cyan, but not bold    
    ```
    
    
### **setLevel** *(level)*

Define logging level.

#### Parameters
- **level** *String*

	Desired level for this logger instance. Can be `trace`, `debug`, `info`, `warn` or `error`.


## Examples

#### Basic example

```javascript
var NOOT = require('noot')('logger');

var logger = NOOT.Logger.create({
  level: 'info'
});

logger.info('Eval is evil');
// Will print 'Eval is evil' to the console

logger.debug('Eval is evil');
// Will not be printed
```

#### Customize messages

```javascript
var NOOT = require('noot')('logger');

var logger = NOOT.Logger.create({
  level: 'info',
  formatMessage: function(message, level) {
    return ['[', level.toUpperCase(), '] ', message].join('');
  }
});

logger.info('Eval is evil');
// [INFO] Eval is evil

logger.warn('Eval is evil');
// [WARN] Eval is evil

logger.debug('Eval is evil');
// Still not printed
```

#### Customize transport

```javascript
var NOOT = require('noot')('logger');
var fs = require('fs');
var path = require('path');

var files = {
  error: path.resolve(process.cwd(), '../logs/errors.log'),
  warn: path.resolve(process.cwd(), '../logs/warnings.log')
};

var logger = NOOT.Logger.create({
  level: 'info',
  
  formatMessage: function(message) {
    return new Date().toISOString() + ' ' + message;
  },
  
  transportCallback: function(err) {
    if (err) // Send an alert
  },
  
  transport: function(message, level, callback) {
    // Log to the console
  	console.log(message);
    
    // Log to files
    if (level === 'error' || level === 'warn) {
      return fs.appendFile(files[level], message, callback);
    } else {
      return callback();
    }
    
  }
});
```