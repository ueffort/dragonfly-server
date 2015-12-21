/**
 * Created by tutu on 15-12-18.
 */
var config = require("app/config");
var coreApp = require("./core/index");
var dataApp = require("./data/index");
coreApp = new coreApp;
coreApp.init();
dataApp = new dataApp;
dataApp.init();
