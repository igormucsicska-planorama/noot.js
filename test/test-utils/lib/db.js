var NOOT = nootrequire('namespace');
var mongoose = require('mongoose');

var DB = NOOT.Namespace.create({

  create: function(options, callback) {
    var hasFirstConnected = false;
    var db = mongoose.createConnection('mongodb://localhost:27017/' + options.name);
    db.on('error', function(err) {
      throw err;
    });
    db.on('connected', function() {
      if (!hasFirstConnected) {
        hasFirstConnected = true;
        if (options.drop) return db.db.dropDatabase(callback);
        else return callback();
      }
    });
    return db;
  }

});

module.exports = DB;