/**
 * Created by tutu on 15-12-17.
 */

/// <reference path="../libs/ts/config.d.ts" />
/// <reference path="../libs/ts/express.d.ts" />

import {app} from '../module/app'
import * as config from "app/config"
import dataRouter from "./router/data"
import {agentHandle} from "./handle/agentHandle"

export class dataApp extends app{

    agentHandle:agentHandle;

    constructor() {
        super();
        this.agentHandle = agentHandle.getInstance();
    }

    private listenAgent():void{
        this.agentHandle.wait();
        console.log("agent listen start");
    }

    public init():void{
        this.express.use([dataRouter]);
        super.errorHandle();
        this.express.listen(config['DATA_CONFIG']['PORT'], function(){
            console.log("data api listen port:", config['DATA_CONFIG']['PORT']);
        });
        this.listenAgent();
    }
}
