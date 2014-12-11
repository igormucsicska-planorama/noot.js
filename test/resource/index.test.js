var NOOT = nootrequire('express-resource');
var express = require('express');
var mongoose = require('mongoose');
var http  = require('http');
var supertest = require('supertest');
var async = require('async');
var _ = require('lodash');
var bodyParser = require('body-parser');


var DB_NAME = 'noot-express-resource-test';


describe('NOOT.ExpressResource', function() {

  var User;
  var resource;
  var app = express();

  app.use(bodyParser());

  before(function(done) {
    return mongoose.connect('mongodb://localhost:27017/' + DB_NAME, done);
  });

  before(function(done) {
    return mongoose.connection.db.collectionNames(function(err, names) {
      if (err) done(err);
      if (_.find(names, { name: DB_NAME + '.users' })) {
        return mongoose.connection.collection('users').drop(done);
      } else {
        return done();
      }
    });
  });

  before(function() {
    var UserSchema = new mongoose.Schema({
      firstName: String,
      lastName: String,
      email: String,
      password: String
    }, {
      collection: 'users'
    });

    User = mongoose.model('User', UserSchema);
  });

  it('should create an instance', function() {
    resource = NOOT.ExpressResource.create({
      apiVersion: 'v1',
      path: '/user',
      model: User,
      nonSelectableFields: ['__v', 'password'],
      sortableFields: ['firstName', 'lastName', 'email', 'id', '_id'],
      filterableFields: ['email', 'id', '_id']
    });

    return resource.should.be.an.instanceOf(NOOT.ExpressResource);
  });

  it('should have right selectable fields', function() {
    resource.selectableFields.should.deep.eql(['firstName', 'lastName', 'email', '_id', 'id']);
  });

  it('should have right sortable fields', function() {
    resource.sortableFields.should.deep.eql(['firstName', 'lastName', 'email', 'id', '_id']);
  });

  it('should have right filterable fields', function() {
    resource.filterableFields.should.deep.eql(['email', 'id', '_id']);
  });

  describe('Routes', function() {

    var usersInDb;

    before(function(done) {
      return http.createServer(app).listen(8870, done);
    });

    before(function() {
      resource.register(app);
      return app.use(function(req, res) {
        return res.status(404).json();
      });
    });

    it('should include apiVersion', function(done) {
      return supertest(app)
        .get('/user')
        .expect(404, done);
    });

    it('should create documents (POST)', function(done) {
      var users = [
        { firstName: 'John', lastName: 'Doe', email: 'johndoe@toto.com' },
        { firstName: 'Jane', lastName: 'Doe', email: 'janedoe@toto.com' },
        { firstName: 'Mister', lastName: 'Nobody', email: 'misternobody@toto.com' }
      ];

      return async.each(users, function(userDef, cb) {
        return supertest(app)
          .post('/v1/user')
          .send(userDef)
          .expect(201, cb);
      }, function(err) {
        if (err) return done(err);
        return User.count(function(err, count) {
          if (err) return done(err);
          count.should.eql(users.length);
          return done();
        });
      });
    });

    it('should only return selectable fields (GET)', function(done) {
      return supertest(app)
        .get('/v1/user')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          var data = res.body.data;
          data.should.be.an('array');
          data.forEach(function(item) {
            item.id = item._id;
            resource.selectableFields.should.deep.eql(Object.keys(item));
          });
          usersInDb = data;
          return done();
        });
    });

    it('should return a single document (GET)', function(done) {
      return supertest(app)
        .get('/v1/user/' + usersInDb[0].id)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.data.should.be.an('object');
          res.body.data.id = res.body.data._id;
          res.body.data.should.contain.keys(resource.selectableFields);
          return done();
        });
    });

    it('should return 404 (GET - not existing id)', function(done) {
      return supertest(app)
        .get('/v1/user/5484c725f33e5a5755c67415')
        .expect(404, done);
    });

    it('should only return selected fields (GET)', function(done) {
      return supertest(app)
        .get('/v1/user/' + usersInDb[0].id + '?select=firstName,lastName')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.data.should.be.an('object');
          res.body.data.should.have.keys(['firstName', 'lastName', '_id']);
          return done();
        });
    });

    it('should not return unselected fields (GET)', function(done) {
      return supertest(app)
        .get('/v1/user/' + usersInDb[0].id + '?unselect=firstName,lastName')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.data.should.be.an('object');
          res.body.data.should.not.have.keys(['firstName', 'lastName']);
          return done();
        });
    });

    it('should match document from query filter (GET)', function(done) {
      return supertest(app)
        .get('/v1/user?email=johndoe@toto.com')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.data.should.be.an('array').and.have.length(1);
          res.body.data[0]._id.should.eql(_.find(usersInDb, { email: 'johndoe@toto.com' })._id);
          return done();
        });
    });

    it('should not match document from query filter - forbidden (GET)', function(done) {
      return supertest(app)
        .get('/v1/user?password=johndoe@toto.com')
        .expect(400, done);
    });

    it('should sort documents from query sortBy (GET)', function(done) {
      return supertest(app)
        .get('/v1/user?sortBy=email')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          var data = res.body.data;
          data.should.be.an('array').and.have.length(3);
          data[0].email.should.eql('janedoe@toto.com');
          data[1].email.should.eql('johndoe@toto.com');
          data[2].email.should.eql('misternobody@toto.com');
          return done();
        });
    });

    it('should sort routes correctly', function (done) {
      var routesToSort = [
        { path: '/visit/:id/user_feedback',
          method: 'post' },
        { path: '/visit/user_fed-back/:id',
          method: 'post' },
        { path: '/api/visit',
          method: 'post' },
        { path: '/api/planorama/:id/picture',
          method: 'post' },
        { path: '/api/planorama',
          method: 'post' },
        { path: '/api/tasks',
          method: 'post' },
        { path: '/api/tasks/userActivity',
          method: 'post' },
        { path: '/api/autoreco/:visit_id/photo/:photo_id',
          method: 'post' },
        { path: '/verify-question-form',
          method: 'post' },
        { path: '/api/plajProducts/create',
          method: 'post' },
        { path: '/api/admin',
          method: 'post' }
      ];

      NOOT
        .ExpressResource.orderRoutes(routesToSort)
        .map(function (route) {
          return _.pick(route, ['path', 'method']);
        })
        .should.deep.eql([
          { path: '/api/autoreco/:visit_id/photo/:photo_id',
            method: 'post' },
          { path: '/api/planorama/:id/picture',
            method: 'post' },
          { path: '/visit/user_fed-back/:id',
            method: 'post' },
          { path: '/visit/:id/user_feedback',
            method: 'post' },
          { path: '/api/tasks/userActivity',
            method: 'post' },
          { path: '/api/plajProducts/create',
            method: 'post' },
          { path: '/api/visit',
            method: 'post' },
          { path: '/api/planorama',
            method: 'post' },
          { path: '/api/tasks',
            method: 'post' },
          { path: '/api/admin',
            method: 'post' },
          { path: '/verify-question-form',
            method: 'post' }
        ]);

      done();

    })

  });


});