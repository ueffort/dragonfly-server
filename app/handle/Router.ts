/**
 * Created by tutu on 16-3-13.
 */

/// <reference path="../../typings/express/express.d.ts" />

import * as express from "express";
import Controller from "../abstract/Controller";

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

/**
 * 处理请求参数解写
 * @param param
 * @param action
 * @returns {function(express.Request, express.Response, any): void}
 */
export function handle(param:any[], action:(...args:any[])=>Promise<any>) {
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
        args.push(req);
        args.push(res);
        action.apply(Controller, args).then(function(result:any){
            res.json(result);
        }).catch(function(err:Error){
            next(err);
        });
    }
};