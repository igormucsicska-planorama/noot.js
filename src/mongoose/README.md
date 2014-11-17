# NOOT.Mongoose

Implements schema inheritance

## Usage

```javascript
var NOOT = require('noot')('mongoose');

var Schema = NOOT.Mongoose.Schema;

var yourSchema = Schema.extend({
  schema: {
    // Place here the properties
  },
  methods: {
    // Place here the methods
  },
  statics: {
    // Place here the statics
  },
  options {
    // Place here the options
  }
});
```

## Example
```javascript
var NOOT = require('noot')('mongoose');

var Schema = NOOT.Mongoose.Schema;
```

### Create your first Schema

```javascript
var PersonSchema = Schema.extend({
  schema: {
    name: { type: String, required: true },
    age: { type: Number, required: true }
  },

  methods: {
    sayHello: function() {
      return 'Hello, my name is ' + this.name;
    }
  },

  statics: {
    joinCompany: function() {
      return 'You joined';
    }
  },

  options: {
    strict: false,
    collection: 'person',
    versionKey: false
  }
});
```

### Extend your Schema

```javascript
var EmployeeSchema = PersonSchema.extend({
  schema: {
    job: String
  },

  methods: {
    sayHello: function() {
      return this._super() + ', I work as a ' + this.job;
    }
  },

  statics: {
    joinCompany: function () {
      return this._super();
    }
  },

  options: {
    strict: true
  }
});
```

### Declare your models
```javascript
var Person = mongoose.model('Person', PersonSchema);
var Employee = mongoose.model('Employee', EmployeeSchema);
```


## Middleware

###use-timestamps###

Set CreatedOn and UpdatedOn automatically

** From namescpace **

```javascript
 var schema = Schema.extend({});

 NOOT.Mongoose.useTimestamps(schema);

```

** From schema method **

```javascript
 var schema = Schema.extend({}).useTimestamps();;

```
