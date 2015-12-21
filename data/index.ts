/**
 * Created by tutu on 15-12-17.
 */

/// <reference path="../libs/ts/config.d.ts" />
/// <reference path="../libs/ts/express.d.ts" />

import app = require('../module/app');
import config = require("app/config");
import dataRouter = require("./router/data");

class dataApp extends app{

    constructor() {
        super();
    }

    public init():void {
        this.express.use([dataRouter]);
        super.errorHandle();
        this.express.listen(config['DATA_CONFIG']['PORT'], function () {
        });
    }
}

export = dataApp
