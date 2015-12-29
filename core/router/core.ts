/**
 * Created by tutu on 15-12-18.
 */


/// <reference path="../../libs/ts/config.d.ts" />
/// <reference path="../../typings/express/express.d.ts" />

import * as express from "express"
import * as config from "app/config"

var core:express.Router = express.Router();

core.get('/core/', function(req:express.Request, res:express.Response, next:any){

});

export default core;
