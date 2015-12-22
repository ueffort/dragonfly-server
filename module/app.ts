/**
 * Created by tutu on 15-12-17.
 */

/// <reference path="../libs/ts/config.d.ts" />
/// <reference path="../libs/ts/express.d.ts" />

import express = require("express")
import * as config from "app/config"
export class app {

    express:express.Application;

    constructor() {
        this.express = express();
    }

    public errorHandle():void {
        this.express.use(function(req:express.Request, res:express.Response, next:any){
            res.status(404).send('Sorry cant find that!');
        });
        this.express.use(function(err:Error, req:express.Request, res:express.Response, next:any){
            res.status(500).send('Something broke!');
        });
    }
}



