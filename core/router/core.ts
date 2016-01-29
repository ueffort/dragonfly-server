/**
 * Created by tutu on 15-12-18.
 */


/// <reference path="../../typings/express/express.d.ts" />

import * as express from "express";
import CoreApp from "../App";
import Dispatch from "../../app/Dispatch";

export default function routerHandle(app:CoreApp):express.Router{
    let router: express.Router = express.Router();
    // 全局登录验证
    router.use(Dispatch.session(app,['login'], function(session:{[key: string]: any}, notice:(result:boolean)=>void){
        notice(true);
    }));
    router.get("/core/", function(req: express.Request, res: express.Response, next: any) {
        return;
    });
    return router;
};
