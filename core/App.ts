/**
 * Created by tutu on 15-12-17.
 */

/// <reference path="../typings/node/node.d.ts" />

import App from "../app/App";
import * as express from "express";
import coreRouter from "./router/core";
import webRouter from "./router/web";
import * as path from "path";
import bodyParser = require("body-parser");

class CoreApp extends App {

    protected name = "core";

    constructor() {
        super();
    }

    protected init(): void {
        this.express.set("views", path.join(__dirname, "views"));
        this.express.set("view engine", "ejs");
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use(bodyParser.json());
        this.express.use(coreRouter(this), webRouter(this));

        this.listen(this.config.CORE_CONFIG.PORT);
    }

    /**
     * 错误处理handle
     */
    protected errorHandle(): void {
        this.express.use((req: express.Request, res: express.Response, next: any)=>{
            res.status(200).json({status:404, message:"not find!"});
        });
        this.express.use((err: Error, req: express.Request, res: express.Response, next: any)=>{
            this.logger.error(err);
            res.status(200).json({status:500, message:err.message});
        });
    }
}

export default CoreApp
