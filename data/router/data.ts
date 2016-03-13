/**
 * Created by tutu on 15-12-18.
 */

/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/body-parser/body-parser.d.ts" />

import * as express from "express";
import Dispatch from "../../app/abstract/Dispatch";
import Controller from "../../app/abstract/Controller";
import DataApp from "../App";
import {token} from "../handle/mysql";
import * as bodyParser from "body-parser";
import  * as session from "express-session";
import {Auth} from "../controllers/auth";
import {handle} from "../../app/handle/Router";

export default function routerHandle(app: DataApp): express.Router{

    let router: express.Router = express.Router();
    Controller.setApp(app);

    router.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 24*60*60*1000 }}));
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(bodyParser.json());

    /**
     * 验证token
     */
    router.use(Dispatch.token(app, "token", function(tokenStr: string){
        return token(app.mysql(), tokenStr).then(function(auth:any){
            return !!auth ? !!auth.state : false;
        }).catch(function(err){
            return false;
        });
    }));


    /**
     * 接口定义,同步swagger
     */
    router.get("/auth", handle([{name:"token", query:true}], Auth.get));
    return router;
}
