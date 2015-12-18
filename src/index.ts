/**
 * Created by tutu on 15-12-17.
 */

/// <reference path="libs/ts/config.d.ts" />
/// <reference path="libs/ts/express.d.ts" />

import expressModule = require("express");
import config = require("app/config");

class app{

    express:expressModule.Application;

    constructor(){
        this.express = expressModule();
    }

    public dataInit():void{
        this.express.listen(80);
    }

    public coreInit():void{
        this.express.listen(80);
    }

}

export = app
