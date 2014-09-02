# NOOT.Configurator

Lightweight module to deal with environments configurations. Will look into a determined folder for those config files and return the properties corresponding to the environment. Possibility to easily share properties across environments by specifying a common config object that environment specific properties will merged into.


## Usage
```javascript
var NOOT = require('noot')('configurator');

var configurator = NOOT.Configurator.create({ env: /* mandatory environment name */ });
```


## Properties

### **env** *String*

Environment's name (such as "production", "staging", "dev"...). This name will be used to look into your config files and retrieve the right configuration for the given environment. No default value, this property *has to be defined*.

### **directory** *String*

Path of directory to look for configuration files. Defaults to `/config/`.

### **get** *(name, ...properties)*

Main function to retrieve a configuration. Optionnal `properties` names can be provided to get nested properties in the config object.

#### Parameters

- **name** *String*

	Configuration file's name to look for.

- [**properties**] *String*

	Nested properties to get from main config object.

#### Returns

If only `name` is provided, the configuration object corresponding to the environment.

If one or many `properties` are provided, the value obtained by recursively getting next property name from the previous result. 

## Examples

#### Basic example
Let's say you have a file in `/config/mongo.js` that looks like the following :

```javascript
module.exports = {
  production: {
    host: 'host@mongoprovider.com', port: 34765, name: 'myapp', user: 'me', password: 'youllnotfindit'
  },
  staging: {
    host: 'host@otherprovider.com', port: 28888, name: 'myapp', user: 'me', password: 'toohardforyou'
  },
  dev: {
    host: 'localhost', port: 27017, name: 'myapp'
  }
};

```


Instanciate the configurator module with your current environment :

```javascript
var NOOT = require('noot')('configurator');

var configurator = NOOT.Configurator.create({ env: 'dev' });
```

Get the configuration for your Mongo database :
```javascript
var mongoConfig = configurator.get('mongo');
// { host: 'localhost', port: 27017, name: 'myapp' }
```

Get a specific property from your Mongo configuration :
```javascript
var mongoPort = configurator.get('mongo', 'port');
// 27017
```

#### Share properties across environments
Modify your `/config/mongo.js` file to the following :
```javascript
module.exports = {
  all: {
    name: 'myapp'
  },
  production: {
    host: 'host@mongoprovider.com', port: 34765, user: 'me', password: 'youllnotfindit'
  },
  staging: {
    host: 'host@otherprovider.com', port: 28888, user: 'me', password: 'toohardforyou'
  },
  dev: {
    host: 'localhost', port: 27017
  }
};
```

Let's get your database's name :
```javascript
configurator.get('mongo', 'name');
// 'myapp'
```

**IMPORTANT** Properties from `all` and `dev` are *merged*, **not** simply *override* :

##### Arrays

In `/config/app.js` :
```javascript
module.exports = {
  all: {
    tasks: [ 'do-something', 'keep-alive' ]
  },
  dev: {
    tasks: [ 'do-something', 'something-else' ]
  }
};
```
Get the tasks for `dev` environment :
```javascript
configurator.get('app', 'tasks');
// [ 'do-something', 'keep-alive', 'something-else' ]
```

##### Objects

In `/config/app.js` :
```javascript
module.exports = {
  all: {
    whatever: {
      foo: { bar: 'noot' }
    }
  },
  dev: {
    whatever: {
      foo: { other: 'toon' }
    }
  }
};
```
Get the whatever property for `dev` environment :
```javascript
configurator.get('app', 'whatever');
//{
//  nested: {
//    foo: {
//      bar: 'noot',
//      other: 'toon'
//    }
//  }
//}
```


#### Specifying a custom directory for config files

If your prefer to use a custom folder instead of the default `/config/` one, configure it as follows :

```javascript
var path = require('path');
var NOOT = require('noot')('configurator');

var configurator = NOOT.Configurator.create({
  env: 'dev',
  directory: path.join(process.cwd(), 'path/to/directory')
});
```