/**
 * Created by tutu on 15-12-17.
 */

/// <reference path="../libs/ts/config.d.ts" />
/// <reference path="../libs/ts/express.d.ts" />

import {app} from '../module/app'
import * as config from "app/config"
import coreRouter from "./router/core"
import webRouter from "./router/web"

export class coreApp extends app{

    constructor() {
        super();
    }

    public init():void {
        this.express.use([webRouter,coreRouter]);
        super.errorHandle();
        this.express.listen(config['CORE_CONFIG']['PORT'], function(){
            console.log("core listen port:", config['DATA_CONFIG']['PORT']);
        });
    }
}
