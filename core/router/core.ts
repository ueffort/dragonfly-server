/**
 * Created by tutu on 15-12-18.
 */


/// <reference path="../../typings/express/express.d.ts" />

import * as express from "express";
import CoreApp from "../App";
import Dispatch from "../../app/Dispatch";
import Controller from "../Controller";
import {Api} from "../controllers/api";

interface ParamDesc {
    name: string;
    /**
     * 只能设置一个,获取整个body
     */
    body?: boolean;
    query?: boolean;
    form?: boolean;
    /**
     * 参数在path中,位数按index计算
     */
    path?: boolean;
    /**
     * 默认为0,用于设定path的参数,从后向前
     */
    index?: number;
    /**
     * 针对query的数组支持
     */
    array?: boolean;
}

export default function routerHandle(app:CoreApp):express.Router{
    let router: express.Router = express.Router();
    Controller.setApp(app);
    // 全局登录验证
    router.use(Dispatch.session(app,['/api/login'], function(session: {[key: string]: any}){
        return Promise.resolve(true);
    }));

    /**
     * 处理请求参数解写
     * @param param
     * @param action
     * @returns {function(express.Request, express.Response, any): void}
     */
    let handle = function(param:any[], action:(...args:any[])=>Promise<any>) {
            return function(req: express.Request, res: express.Response, next: any):void{
                let args = param.map(function(value:ParamDesc){
                    if(value.body){
                        return req.body;
                    }else if(value.query){
                        let v:string = req.query[value.name];
                        return value.array ? v.split(',') : v;
                    }else if(value.path){
                        let a:string[] = req.path.split("/");
                        return value.index ? a.splice(a.length - value.index - 1, 1) : a.pop();
                    }else if(value.form){
                        return req.body[value.name];
                    }
                });
                action.apply(Controller, args).then(function(result:any){
                    res.json(result);
                }).catch(function(err:Error){
                    next(err);
                });
            }
        };

    router.get("/api/login", handle([{name:"name", form:true}, {name:"password", form:true}], Api.login));

    router.get("/api/register", handle([{name:"name", form:true}, {name:"password", form:true}], Api.register));

    return router;
};
