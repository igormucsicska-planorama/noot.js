# NOOT.js

## Node.js Obejct Oriented Toolset




### Installation
```shell
$ npm install noot --save
```


### Usage
```javascript
var NOOT = require('bluebirds');
```


### Modules

Create your first class :
``` javascript
var Person = NOOT.Object.extend({
  firstName: '',
  lastName: '',
  
  init: function() {
    if(!this.lastName || !this.firstName) throw new Error('John Doe is a myth');
  },
  
  sayHello: function() {
    console.log('Hello, my name is', this.getFullName());
  },
  
  getFullName: function() {
    return this.firstName + ' ' + this.lastName;
  }
});


var person = Person.create({
  firstName: 'Sylvain',
  lastName: 'Estevez'
});

person.sayHello();
```

``` shell
$ Hello, my name is Sylvain Estevez
```

Extend your class :
``` javascript
var Employee = Person.extend({
  job: '',
  
  sayHello: function() {
    console.log(this._super(), ', I work as a ', this.job);
  }
});


var employee = Employee.create({
  firstName: 'Sylvain',
  lastName: 'Estevez',
  job: 'developer'
});

employee.sayHello();
```

``` shell
$ Hello, my name is Sylvain Estevez, I work as a developer
```



