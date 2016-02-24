/**
 * Created by tutu on 15-12-18.
 */

/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="../../typings/react/react-dom.d.ts" />

import * as express from "express";
import jsonFile from "../../app/tools/JsonFile";
import CoreApp from "../App";

export default function routerHandle(app: CoreApp){
    let router: express.Router = express.Router();


    router.use("/static", express.static("./static"));

    router.get("*", function(req: express.Request, res: express.Response, next: any){
        let data = {Login: {isLogin: true}};
        let resource = jsonFile.read("app/resource");
        let dev = app.config.DEBUG ? true : false;
        res.render("index", {dev: dev, data: JSON.stringify(data), resource: resource, resUrl:function(url: string){
            return dev ? "http://localhost:9090/" + url : url;
        }});
    });
    return router;
};
