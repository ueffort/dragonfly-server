/**
 * Created by tutu on 15-12-17.
 */

/// <reference path="../libs/ts/config.d.ts" />
/// <reference path="../typings/node/node.d.ts" />

import {app} from '../module/app'
import * as config from "app/config"
import coreRouter from "./router/core"
import webRouter from "./router/web"
import * as path from "path"

export class coreApp extends app{

    constructor() {
        super();
    }

    public init():void {
        this.express.set('views', path.join(__dirname, 'views'));
        this.express.set("view engine", "ejs");
        this.express.use(webRouter, coreRouter);
        super.errorHandle();
        this.express.listen(config['CORE_CONFIG']['PORT'], function(){
            console.log(config);
            console.log("core listen port:", config['CORE_CONFIG']['PORT']);
        });
    }
}
