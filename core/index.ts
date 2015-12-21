/**
 * Created by tutu on 15-12-17.
 */

/// <reference path="../libs/ts/config.d.ts" />
/// <reference path="../libs/ts/express.d.ts" />

import app = require('../module/app');
import config = require("app/config");
import coreRouter = require("./router/core");
import webRouter = require("./router/web");

class coreApp extends app{

    constructor() {
        super();
    }

    public init():void {
        this.express.use([webRouter,coreRouter]);
        this.errorHandle();
        this.express.listen(config['CORE_CONFIG']['PORT'], function () {
            console.log("core listen port:", config['DATA_CONFIG']['PORT']);
        });
    }
}

export = coreApp
