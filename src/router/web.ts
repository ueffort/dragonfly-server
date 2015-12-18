/**
 * Created by tutu on 15-12-18.
 */

/// <reference path="../libs/ts/config.d.ts" />
/// <reference path="../libs/ts/express.d.ts" />

import expressModule = require("express");
import config = require("app/config");

var web:expressModule.Router = expressModule.Router();

web.get('/', function (req, res, next) {
    res.sendFile('./web/index.html');
});

web.use('/static', expressModule.static('./web/static'));

export = web;