/**
 * Created by tutu on 16-3-24.
 */
require('should');
var App = require('app/App').default;
var Model = require('app/abstract/BaseModel').BaseModel;

describe('BaseModel', function () {
    var id1 = 0;
    var id2 = 0;
    describe("add", function () {
        it('add -> filed and value', function (done) {
            var app = new App();
            var model = new Model(app);
            var modelHandle = {
                add: true,
                tableName: 'test',
                filed:["test1", "test2"],
                value:{test1: "test", test2: 1, test3:new Date().getTime()/1000}
            };
            model.handle(modelHandle).then(function(result){
                result.should.be.an.Object;
                result["insertId"].should.be.a.Number;
                id1 = result["insertId"];
                done();
            }).catch(function(error){
                done();
            });
        });
        it('add -> value', function (done) {
            var app = new App();
            var model = new Model(app);
            var modelHandle = {
                add: true,
                tableName: 'test',
                value:{test1: "test", test2: 1, test3:new Date().getTime()/1000}
            };
            model.handle(modelHandle).then(function(result){
                result.should.be.an.Object;
                result["insertId"].should.be.a.Number;
                id2 = result["insertId"];
                done();
            }).catch(function(error){
                done();
            });
        });
    });
    describe("update", function () {
        it('update -> filed and value', function (done) {
            var app = new App();
            var model = new Model(app);
            var modelHandle = {
                update: true,
                tableName: 'test',
                filed:["test1", "test2"],
                where:[["id", "=", id1]],
                value:{test1: "test", test2: 2, test3:new Date().getTime()/1000}
            };
            model.handle(modelHandle).then(function(result){
                result.should.be.an.Object;
                var change = result["changedRows"];
                change.should.equal(1);
                done();
            }).catch(function(error){
                console.log(error);
                done();
            });
        });
        it('update -> value', function (done) {
            var app = new App();
            var model = new Model(app);
            var modelHandle = {
                update: true,
                tableName: 'test',
                where:[["id", "=", id2]],
                value:{test1: "test", test2: 2, test3:new Date().getTime()/1000}
            };
            model.handle(modelHandle).then(function(result){
                result.should.be.an.Object;
                var change = result["changedRows"];
                change.should.equal(1);
                done();
            }).catch(function(error){
                console.log(error);
                done();
            });
        });
    });
    describe("select", function () {
        it('select -> filed and where', function (done) {
            var app = new App();
            var model = new Model(app);
            var modelHandle = {
                select: true,
                tableName: 'test',
                filed:["test1", "test2", "test3"],
                where:[["id", "=", id1]]
            };
            model.handle(modelHandle).then(function(result){
                console.log(result);
                result.should.be.an.Object;
                done();
            }).catch(function(error){
                console.log(error);
                done();
            });
        });
        it('select -> where', function (done) {
            var app = new App();
            var model = new Model(app);
            var modelHandle = {
                select: true,
                tableName: 'test',
                where:[["id", "=", id2]]
            };
            model.handle(modelHandle).then(function(result){
                console.log(result);
                result.should.be.an.Object;
                done();
            }).catch(function(error){
                console.log(error);
                done();
            });
        });
        it('select -> where', function (done) {
            var app = new App();
            var model = new Model(app);
            var modelHandle = {
                select: true,
                tableName: 'test',
                where:[["id", ">", 0]]
            };
            model.handle(modelHandle).then(function(result){
                console.log(result);
                result.should.be.an.Object;
                done();
            }).catch(function(error){
                console.log(error);
                done();
            });
        });
    });
});
