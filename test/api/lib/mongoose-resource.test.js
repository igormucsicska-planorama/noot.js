var NOOT = nootrequire('api', 'mongoose');
var mongoose = require('mongoose');

describe('NOOT.API.MongooseResource', function() {

  describe('.toAPIField()', function() {

    it('should create a map of NOOT.API.Field from Mongoose schema', function() {

      var schema = NOOT.Mongoose.Schema.extend({

        schema: {
          name: {
            first: String,
            last: String
          },
          age: Number,
          email: { type: String, required: true },
          blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
          messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
          joinedOn: { type: Date, default: function() { return new Date(); } }
        }

      });

      console.log(schema);

    });


  });


});