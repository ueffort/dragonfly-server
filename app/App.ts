/**
 * Created by tutu on 15-12-17.
 */

/// <reference path="../typings/express/express.d.ts" />

import * as express from "express";
import jsonFile from "./tools/JsonFile";
import {Logger, create, middle as loggerMiddle} from "./tools/Log";

const config = jsonFile.read("./config");

class App {

    public express: express.Application;
    public logger: Logger;

    public static config(): any {
        return config;
    }
    constructor() {
        this.express = express();
        this.logger = create("", config.debug);
    }

    public errorHandle(): void {
        this.express.use(loggerMiddle(this.logger));
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



