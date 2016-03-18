/**
 * Created by tutu on 16-2-2.
 */
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../../typings/express/express.d.ts" />

import * as express from "express";
import {Promise} from "../../app/tools/Promise";
import Controller from "../../app/abstract/Controller";
import CoreApp from "../App";

export default class Playbook extends Controller{

    protected __resultHandle(req: express.Request, res: express.Response, next: any, result: any){
        return res.json(CoreApp.formatResult(result));
    }

    public playbookSetting(type: string, req: express.Request, res: express.Response):Promise<any>{
        return Promise.resolve({});
    }

    public playbookStatus(id: number, req: express.Request, res: express.Response):Promise<any>{
        return Promise.resolve({});
    }

    public playbookList(limit: number = 20, start: number = 1, count: number = 0, req: express.Request, res: express.Response):Promise<any>{
        return Promise.resolve({});
    }

    public playbookAdd(type: string, data: any, req: express.Request, res: express.Response):Promise<any>{
        return Promise.resolve({});
    }

    public playbookUpdate(id: number, data: any, req: express.Request, res: express.Response):Promise<any>{
        return Promise.resolve({});
    }

    public playbookDelete(id: number, req: express.Request, res: express.Response):Promise<any>{
        return Promise.resolve({});
    }
}