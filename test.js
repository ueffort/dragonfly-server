/**
 * Created by tutu on 16-1-31.
 */

var Promise = require('es6-promise').Promise;

//console.log("===================p1 start====================");
//var p1 = new Promise(function(resolve, reject){
//    resolve();
//});
//
//p1.then(function(){
//    console.log("resolve 1");
//}).then(function(){
//    console.log("resolve 2");
//});
//console.log("===================p1 end====================");
//console.log("===================p2 start====================");
//var p2 = new Promise(function(resolve, reject){
//    reject();
//    //resolve();
//});
//
//p2.then(function(){
//    console.log("resolve 1");
//    //return Error("resolve error");
//    throw Error("resolve error");
//    return "resolve";
//}, function(){
//    console.log("reject 1");
//    throw Error("reject error");
//    return "reject";
//}).catch(function(value){
//    console.log("catch 1:"+value);
//    return "catch";
//}).then(function(value){
//    console.log("resolve 2:", value);
//    return "resolve";
//}).catch(function(value){
//    console.log("catch 2:"+value);
//    return "catch";
//});
//console.log("===================p2 end====================");
//console.log("===================p3 start====================");
var p3 = new Promise(function(resolve, reject){
    reject();
});

p3.then(function(){
    console.log("resolve 1");
    return "resolve";
}, function(){
    console.log("reject 1");
    return "reject";
}).then(function(value){
    console.log("resolve 2:", value);
    throw Error("resolve error");
    return "resolve";
}).catch(function(value){
    console.log("catch 2:"+value);
    return "catch";
}).then(function(value){
    console.log("resolve 3:", value);
    return "resolve";
}).catch(function(value){
    console.log("catch 3:"+value);
    return "catch";
});
//console.log("===================p3 end====================");
//console.log("===================p4 start====================");
//var p4 = new Promise(function(resolve, reject){
//   reject();
//});
//
//p4.then(function(){
//    console.log("resolve 1");
//    return "resolve";
//}).then(function(){
//    console.log("resolve 2");
//    return "resolve";
//}, function(){
//    console.log("reject 2");
//    return "reject";
//});
//console.log("===================p4 start====================");