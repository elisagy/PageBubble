/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newWebpage;

describe('Webpage API:', function() {
  describe('GET /api/webpages', function() {
    var webpages;

    beforeEach(function(done) {
      request(app)
        .get('/api/webpages')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          webpages = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(webpages).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/webpages', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/webpages')
        .send({
          name: 'New Webpage',
          info: 'This is the brand new webpage!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newWebpage = res.body;
          done();
        });
    });

    it('should respond with the newly created webpage', function() {
      expect(newWebpage.name).to.equal('New Webpage');
      expect(newWebpage.info).to.equal('This is the brand new webpage!!!');
    });
  });

  describe('GET /api/webpages/:id', function() {
    var webpage;

    beforeEach(function(done) {
      request(app)
        .get(`/api/webpages/${newWebpage._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          webpage = res.body;
          done();
        });
    });

    afterEach(function() {
      webpage = {};
    });

    it('should respond with the requested webpage', function() {
      expect(webpage.name).to.equal('New Webpage');
      expect(webpage.info).to.equal('This is the brand new webpage!!!');
    });
  });

  describe('PUT /api/webpages/:id', function() {
    var updatedWebpage;

    beforeEach(function(done) {
      request(app)
        .put(`/api/webpages/${newWebpage._id}`)
        .send({
          name: 'Updated Webpage',
          info: 'This is the updated webpage!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedWebpage = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedWebpage = {};
    });

    it('should respond with the updated webpage', function() {
      expect(updatedWebpage.name).to.equal('Updated Webpage');
      expect(updatedWebpage.info).to.equal('This is the updated webpage!!!');
    });

    it('should respond with the updated webpage on a subsequent GET', function(done) {
      request(app)
        .get(`/api/webpages/${newWebpage._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let webpage = res.body;

          expect(webpage.name).to.equal('Updated Webpage');
          expect(webpage.info).to.equal('This is the updated webpage!!!');

          done();
        });
    });
  });

  describe('PATCH /api/webpages/:id', function() {
    var patchedWebpage;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/webpages/${newWebpage._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Webpage' },
          { op: 'replace', path: '/info', value: 'This is the patched webpage!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedWebpage = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedWebpage = {};
    });

    it('should respond with the patched webpage', function() {
      expect(patchedWebpage.name).to.equal('Patched Webpage');
      expect(patchedWebpage.info).to.equal('This is the patched webpage!!!');
    });
  });

  describe('DELETE /api/webpages/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/webpages/${newWebpage._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when webpage does not exist', function(done) {
      request(app)
        .delete(`/api/webpages/${newWebpage._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
