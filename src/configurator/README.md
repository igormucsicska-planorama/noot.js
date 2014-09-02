# NOOT.Configurator

Lightweight module to deal with environments configurations.


## Usage
```javascript
var NOOT = require('noot')('configurator');

var configurator = NOOT.Configurator.create({ env: /* environment name */ });
```


## Properties

### **env** *String*

Environment's name (such as "production", "staging", "dev"...). This name will be used to look into your config files and retrieve the right configuration for the given environment. No default value, this property *has to be defined*.

### **directory** *String*

Path of directory to look for configuration files. Defaults to "/config/".

### **get** *(name, ...properties)*

Main function to retrieve a configuration. Optionnal `properties` names can be provided to get nested properties in the config object.

#### Parameters

- **name** *String*

	Configuration file's name to look for.

- [**properties**] *String*

	Nested properties to get from main config object.

#### Returns

If only `name` is provided, the configuration object.

If one or many `properties` are provided, the value obtained by recursively getting next property name from the previous result.

## Examples
