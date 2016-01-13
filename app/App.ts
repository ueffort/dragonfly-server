/**
 * Created by tutu on 15-12-17.
 */

/// <reference path="../typings/express/express.d.ts" />

import * as express from "express";
import jsonFile from "./tools/JsonFile";
import {create, middle as loggerMiddle} from "./tools/Log";

const config = jsonFile.read("app/config");

class App {

    public express: express.Application;
    protected name: string;
    public logger: any;
    public config: any;
    constructor() {
        this.express = express();
        this.config = config;
    }

    protected init(): void {
    }

    /**
     * 启动一个应用,开启生命周期
     */
    public start(): void {
        this.express.set("name", this.name);
        this.init();
        this.logger = create(this.express, config.debug);
        this.express.use(loggerMiddle(this.logger));
        this.errorHandle();
    }

    protected listen(port: number) {
        let self = this;
        this.express.listen(port, function(){
            self.logger.info(self.name, " listen port:", port);
        });
    }

    protected errorHandle(): void {
        this.express.use(function(req: express.Request, res: express.Response, next: any){
            res.status(404).send("Sorry cant find that!");
        });
        this.express.use(function(err: Error, req: express.Request, res: express.Response, next: any){
            console.log(err);
            res.status(500).send("Something broke!");
        });
    }

    get app(): express.Application {
        return this.express;
    }
}

export default App



