/**
 * Created by tutu on 15-12-18.
 */

/// <reference path="../../libs/ts/config.d.ts" />
/// <reference path="../../libs/ts/express.d.ts" />

import express = require("express");
import config = require("app/config");

var data:express.Router = express.Router();

data.get('/data/', function (req:express.Request, res:express.Response, next:any) {

});

export = data;