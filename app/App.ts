/**
 * Created by tutu on 15-12-17.
 */

/// <reference path="../typings/express/express.d.ts" />

import * as express from "express";
class App {

    public express: express.Application;

    constructor() {
        this.express = express();
    }

    public errorHandle(): void {
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



