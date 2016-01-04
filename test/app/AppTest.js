/**
 * Created by tutu on 16-1-4.
 */
var should = require('should');
var App = require('../../app/App').default;
var request = require('supertest');

describe('App', function () {
  it('error handle', function (done) {
    var app = new App;
    app.errorHandle();
    request(app.app)
      .get('/')
      .end(function (err, res) {
        res.statusCode.should.equal(404);
        done();
      });
  });
});
