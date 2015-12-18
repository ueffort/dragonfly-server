/**
 * Created by tutu on 15-12-17.
 */

/// <reference path="libs/ts/config.d.ts" />
/// <reference path="libs/ts/express.d.ts" />

import expressModule = require("express");
import config = require("app/config");
import webRouter = require("./router/web");
import dataRouter = require("./router/data");
import coreRouter = require("./router/core");

class app {

    express:expressModule.Application;

    constructor() {
        this.express = expressModule();
    }

    private errorHandle():void {
        this.express.use(function(req, res, next){
            res.status(404).send('Sorry cant find that!');
        });
        this.express.use(function(err, req, res, next){
            res.status(500).send('Something broke!');
        });
    }

    public dataInit():void {
        this.express.use([dataRouter]);
        this.errorHandle();
        this.express.listen(config['DATA_CONFIG']['PORT'], function () {
            console.log("data init");
        });
    }

    public coreInit():void {
        this.express.use([webRouter,coreRouter]);
        this.errorHandle();
        this.express.listen(config['CORE_CONFIG']['PORT'], function () {
            console.log("core init");
        });
    }
}

export = app
