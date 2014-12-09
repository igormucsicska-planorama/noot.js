# NOOT.Mongoose.Schema

Implement schema inheritance

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

var mongoose = require('mongoose');
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
    job: { type: String, required: true }
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

### Migrate your old data

You can update your old data with a static function migrate

#### Usage
```javascript
Model.migrate(match, function(err) {
  if(err) handleError(err);
})
```

#### Example

In our example, Person is a root model so we don't have to migrate it.

```javascript
Employee.migrate({ job: { $exists : true } }, function(err) {
  if(err) handleError(err);
})

Employee.find(); //should return only person with a job, the documents are instance of Employee.
```

# NOOT.Mongoose.useTimestamps 

 Middleware to set createdOn and updatedOn automatically 

##Usage

### From namespace

```javascript
 var schema = Schema.extend({});
 
 NOOT.Mongoose.useTimestamps(schema);

```

### From schema method 

```javascript
 var schema = Schema.extend({}).useTimestamps();

```

##Example

```javascript
var ObjSchema = Schema.extend({
  schema: { foo: String, bar: Number }
}).useTimestamps();

var Obj = mongoose.model('Obj', ObjSchema);

Obj.create({}, function(err, item){  // Set createdOn and updatedOn to date1 = Date.now()
  if (err) throw(err);
  
  console.log(item.createdOn); // => print date1
  console.log(item.updatedOn); // => print date1
  
  item.foo = 'toto';
  
  // a timeout to simulate an update afterward
  setTimeout(function() {
    item.save(function(err){ // Set updatedOn to date2 = Date.now() = date1 + ~1000 
      if(err) throw(err);
      
      console.log(item.createdOn) // => print date1
      console.log(item.updatedOn) // => print date2
      
    }); 
  }, 1000);
});
```