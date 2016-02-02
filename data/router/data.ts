/**
 * Created by tutu on 15-12-18.
 */

/// <reference path="../../typings/express/express.d.ts" />

import * as express from "express";
import Dispatch from "../../app/Dispatch";
import DataApp from "../App";
import {token} from "../handle/mysql";

export default function routerHandle(app: DataApp): express.Router{

    let router: express.Router = express.Router();
    let mysql = app.mysql();
    let email = app.email();

    /**
     * 验证token
     */
    router.use(Dispatch.token(app, "token", function(tokenStr: string){
        return token(mysql, tokenStr).then(function(auth:any){
            return !!auth;
        }).catch(function(err){
            return false;
        });
    }));

    router.get("/", function(req: express.Request, res: express.Response, next: any) {
        res.send("is ok!!");
    });
    return router;
}
