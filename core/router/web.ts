/**
 * Created by tutu on 15-12-18.
 */

/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="../../typings/react/react-dom.d.ts" />

import * as express from "express";
import * as react from "react";
import * as reactDomServer from "react-dom/server";
import {Container} from "../ui/Container";
import jsonFile from "app/tools/JsonFile";

let web: express.Router = express.Router();

web.get("/", function(req: express.Request, res: express.Response, next: any){
    let props = {};
    let reactHtml = react.createFactory(Container);
    let resource = jsonFile.read("app/resource");
    res.render("index", {reactHtml: reactDomServer.renderToString(reactHtml(props)), resource: resource});
});

web.use("/static", express.static("./static"));

export default web;
