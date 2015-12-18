/**
 * Created by tutu on 15-12-18.
 */

/// <reference path="../libs/ts/config.d.ts" />
/// <reference path="../libs/ts/express.d.ts" />

import expressModule = require("express");
import config = require("app/config");

var core:expressModule.Router = expressModule.Router();

core.get('/core/', function (req, res, next) {

});

export = core;