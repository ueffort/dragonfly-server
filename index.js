/**
 * Created by tutu on 15-12-18.
 */
var config = require("app/config");
var app = require("./"+config['PATH']+"/index");
var dataApp = new app;
var coreApp = new app;
dataApp.dataInit();
coreApp.coreInit();
