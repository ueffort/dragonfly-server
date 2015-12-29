/**
 * Created by tutu on 15-12-18.
 */


/// <reference path="../../libs/ts/config.d.ts" />
/// <reference path="../../libs/ts/resource.d.ts" />
/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="../../typings/react/react-dom.d.ts" />


import * as express from "express"
import * as config from "app/config"
import * as resource from "app/resource"
import * as react from "react"
import * as reactDomServer from "react-dom/server"
import {Container} from "../ui/Container"

var web:express.Router = express.Router();

web.get('/', function(req:express.Request, res:express.Response, next:any){
    var props = {};
    var reactHtml = react.createFactory(Container);
    res.render('index', {resource: resource, reactHtml:reactDomServer.renderToString(reactHtml(props))});
});

web.use('/static', express.static('./static'));

export default web;
