/**
 * Created by tutu on 16-2-2.
 */
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../../typings/express/express.d.ts" />

import * as express from "express";
import {Promise} from "../../app/tools/Promise";
import Controller from "../../app/abstract/Controller";
import {UserModel} from "../model/user";
import {User} from "../model/user";
import CoreApp from "../App";

export default class Api extends Controller{

    protected __resultHandle(req: express.Request, res: express.Response, next: any, result: any){
        return res.json(CoreApp.formatResult(result));
    }

    public login(email: string, password: string, req: express.Request, res: express.Response):Promise<any>{
        return new UserModel(this.app).login(email, password)
            .then((user: User)=>{
                if(user.email) req.session["user"] = {email: user.email};
                return {email: user.email};
            });
    }

    public register(email: string, password: string, req: express.Request, res: express.Response):Promise<any>{
        return new UserModel(this.app).register(email, password)
            .then((user: User)=>{
                if(user.email) req.session["user"] = {email: user.email};
                return {email: user.email};
            });
    }

    public loginOut(req: express.Request, res: express.Response):Promise<any>{
        req.session["user"] = {};
        return Promise.resolve({});
    }
}