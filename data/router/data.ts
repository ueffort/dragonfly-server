/**
 * Created by tutu on 15-12-18.
 */

/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/body-parser/body-parser.d.ts" />

import * as express from "express";
import Dispatch from "../../app/Dispatch";
import DataApp from "../App";
import {token} from "../handle/mysql";
import * as bodyParser from "body-parser";

import Controller from "../Controller";
import {Auth} from "../controllers/auth";

interface ParamDesc {
    name: string;
    body?: boolean;
    query?: boolean;
    /**
     * 只能设置一个,获取path中最后一位
     */
    path?: boolean;
}
export default function routerHandle(app: DataApp): express.Router{

    let router: express.Router = express.Router();
    Controller.setApp(app);

    /**
     * 验证token
     */
    router.use(Dispatch.token(app, "token", function(tokenStr: string){
        return token(app.mysql(), tokenStr).then(function(auth:any){
            return !!auth;
        }).catch(function(err){
            return false;
        });
    }));

    /**
     * 格式化 body
     */
    router.use(bodyParser.json());

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
                    return req.body[value.name];
                }else if(value.query){
                    return req.query[value.name];
                }else if(value.path){
                    return req.path.split("/").pop();
                }
            });
            action.apply(Controller, args).then(function(result:any){
                res.json(result);
            }).catch(function(err:Error){
                next(err);
            });
        }
    };

    /**
     * 接口定义,同步swagger
     */
    router.get("/auth", handle([{name:"token", query:true}], Auth.get));
    return router;
}
