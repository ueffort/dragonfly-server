/**
 * Created by tutu on 15-12-17.
 */

/// <reference path="../typings/node/node.d.ts" />

import App from "../app/App";
import coreRouter from "./router/core";
import webRouter from "./router/web";
import * as path from "path";

class CoreApp extends App {

    constructor() {
        super();
    }

    public init(): void {
        this.express.set("views", path.join(__dirname, "views"));
        this.express.set("view engine", "ejs");
        this.express.use(webRouter, coreRouter);
        super.errorHandle();
        let config = App.config();
        this.express.listen(config.CORE_CONFIG.PORT, function(){
            console.log("core listen port:", config.CORE_CONFIG.PORT);
        });
    }
}

export default CoreApp
