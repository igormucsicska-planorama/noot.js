var NOOT = nootrequire('namespace');
var mongoose = require('mongoose');
var _ = require('lodash');
var async = require('async');

var DB = NOOT.Namespace.create({

  create: function(options, callback) {
    var db = mongoose.createConnection();
    db.open('mongodb://localhost:27017/' + options.name, function() {
      if (options.drop) return db.db.dropDatabase(callback);
      else return callback();
    });
    return db;
  }

});

module.exports = DB;