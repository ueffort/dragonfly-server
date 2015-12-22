/**
 * Created by tutu on 15-12-18.
 */


/// <reference path="../../libs/ts/config.d.ts" />
/// <reference path="../../libs/ts/express.d.ts" />

import express = require("express")
import * as config from "app/config"

var web:express.Router = express.Router();

web.get('/', function(req:express.Request, res:express.Response, next:any){
    res.sendFile('./static/index.html');
});

web.use('/static', express.static('./static'));

export default web;