/**
 * Created by tutu on 15-12-17.
 */

/// <reference path="../typings/node/node.d.ts" />

import App from "../app/App";
import coreRouter from "./router/core";
import webRouter from "./router/web";
import * as path from "path";

class CoreApp extends App {

    protected name = "core";

    constructor() {
        super();
    }

    protected init(): void {
        this.express.set("views", path.join(__dirname, "views"));
        this.express.set("view engine", "ejs");
        this.express.use(coreRouter(this), webRouter(this));

        this.listen(this.config.CORE_CONFIG.PORT);
    }
}

export default CoreApp
