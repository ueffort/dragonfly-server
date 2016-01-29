/**
 * Created by tutu on 15-12-18.
 */

/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="../../typings/react/react-dom.d.ts" />

import * as express from "express";
import * as React from "react";
import * as ReactDomServer from "react-dom/server";
import Container from "../src/ui/containers/Container";
import jsonFile from "../../app/tools/JsonFile";
import CoreApp from "../App";

export default function routerHandle(app: CoreApp){
    let router: express.Router = express.Router();

    router.get("/", function(req: express.Request, res: express.Response, next: any){
        let props = {};
        let reactHtml = React.createFactory(Container);
        let resource = jsonFile.read("app/resource");
        let host = app.config.DEBUG ? "http://localhost:9090/" : "";
        res.render("index", {host: host, reactHtml: ReactDomServer.renderToString(reactHtml(props)), resource: resource});
    });

    router.use("/static", express.static("./static"));
    return router;
};
