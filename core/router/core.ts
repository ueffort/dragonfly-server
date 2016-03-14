/**
 * Created by tutu on 15-12-18.
 */


/// <reference path="../../typings/express/express.d.ts" />

import * as express from "express";
import CoreApp from "../App";
import Dispatch from "../../app/abstract/Dispatch";
import Api from "../controllers/api";
import * as ErrorID from "../ErrorID";
import * as bodyParser from "body-parser";
import  * as session from "express-session";


export default function routerHandle(app:CoreApp):express.Router{
    let router: express.Router = express.Router();

    router.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 24*60*60*1000 }}));
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(bodyParser.json());

    // 全局登录验证
    router.use("/api/*", Dispatch.session(app,['/api/login', '/api/register'], function(session: any){
        let user = session["user"];
        if(user["email"]){
            return Promise.resolve(true);
        }else{
            throw new Error("need login").name =  ErrorID.NEED_LOGIN;
        }
    }));

    let api = new Api(app);

    router.post("/api/login", api.handle([{name:"email", form:true}, {name:"password", form:true}], api.login));

    router.post("/api/register", api.handle([{name:"email", form:true}, {name:"password", form:true}], api.register));

    router.post("/api/loginOut", api.handle([], api.loginOut));

    return router;
};
