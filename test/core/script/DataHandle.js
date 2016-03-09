/**
 * Created by tutu on 16-3-9.
 */

var dataHandle = require("../../../core/script/DataHandle").default;
var should = require('should');

describe('dataHandle', function () {
    it('getAuth', function (done) {
        dataHandle.postAuth("gaojun@limei.com").then(function(result){
            console.log("ok", result);
            done();
        }).catch(function(result){
            console.log("error", result);
            done();
        });
    });
});