/**
 * Created by tutu on 15-12-18.
 */

/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="../../typings/react/react-dom.d.ts" />

import * as express from "express";
import * as React from "react";
import * as ReactDomServer from "react-dom/server";
import Container from "../src/ui/parts/Container";
import jsonFile from "../../app/tools/JsonFile";

let web: express.Router = express.Router();

web.get("/", function(req: express.Request, res: express.Response, next: any){
    let props = {name: "test"};
    let reactHtml = React.createFactory(Container);
    let resource = jsonFile.read("app/resource");
    res.render("index", {reactHtml: ReactDomServer.renderToString(reactHtml(props)), resource: resource});
});

web.use("/static", express.static("./static"));

export default web;
