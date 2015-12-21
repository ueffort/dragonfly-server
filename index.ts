/**
 * Created by tutu on 15-12-18.
 */
/// <reference path="libs/ts/config.d.ts" />

import config = require("app/config");
import core = require("./core/index");
import data = require("./data/index");

var coreApp:core = new core;
coreApp.init();
var dataApp:data = new data;
dataApp.init();
