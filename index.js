/**
 * Created by tutu on 15-12-18.
 */
var config = require("app/config");
var app = require(config['PATH']+"/index");
var thisApp = new app;
thisApp.init();
