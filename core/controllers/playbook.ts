/**
 * Created by tutu on 16-2-2.
 */
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../../typings/express/express.d.ts" />

import * as express from "express";
import {Promise} from "../../app/tools/Promise";
import Controller from "../../app/abstract/Controller";
import CoreApp from "../App";
import PlayBookFactory from "../playbook/PlayBookFactory";
import {BasePlaybook} from "../playbook/BasePlaybook";
import {PlaybookModel} from "../model/playbook";
import {Playbook as PlaybookRecord} from "../model/playbook";
import * as Constant from "../Constant";

export default class Playbook extends Controller{

    protected app:CoreApp;

    constructor(app:CoreApp){
        super(app);
        this.setResultFun(this.resultHandle)
    }

    private resultHandle(req: express.Request, res: express.Response, next: any, result: any){
        return res.json(CoreApp.formatResult(result));
    }

    public state(id: number, req: express.Request, res: express.Response):Promise<any>{
        let playbookModel = new PlaybookModel(this.app);
        return playbookModel.get(id).then((playbookRecord:PlaybookRecord)=>{
            return playbookRecord.toJson();
        });
    }

    public list(num: number = 20, start: number = 0, count: boolean = false, req: express.Request, res: express.Response):Promise<any>{
        let list:any[] = [];
        let playbookModel = new PlaybookModel(this.app);
        list.push(playbookModel.getList([], start, num).then((playbookRecordList:PlaybookRecord[])=>{
            let result:any[] = [];
            for(let i in playbookRecordList){
                result.push(playbookRecordList[i].toJson())
            }
            return result;
        }));
        if(count) list.push(playbookModel.getCount());
        return Promise.all(list).then((results:any[])=>{
            let result:any = {};
            result["list"] = results[0];
            if(count) result["count"] = results[1];
            return result;

        });
    }

    public add(type: string, param: any, req: express.Request, res: express.Response):Promise<any>{
        let playbookType = PlayBookFactory.getPlaybook(type);
        if(!playbookType) return Promise.reject(new Error("playbook type 选择错误"));
        playbookType = new playbookType(this.app);
        playbookType.setParam(param);
        return playbookType.save().then((playbookRecord:PlaybookRecord)=>{
            let task = this.app.task();
            task.events.emit("add", Constant.TASK_TYPE_PLAYBOOK, playbookRecord.id);
            return playbookRecord.toJson();
        });
    }

    public update(id: number, param: any, req: express.Request, res: express.Response):Promise<any>{
        let playbookModel = new PlaybookModel(this.app);
        return playbookModel.get(id).then((playbookRecord:PlaybookRecord)=>{
            if(playbookRecord.state == Constant.ING || playbookRecord.state == Constant.WAIT)
                throw new Error("playbook 执行中不允许修改");
            let playbookType = PlayBookFactory.getPlaybook(playbookRecord.type);
            if(!playbookType) return Promise.reject(new Error("playbook type 选择错误"));
            playbookType = new playbookType(this.app);
            playbookType.setParam(param).reset();
            return playbookType.save().then((playbookRecord:PlaybookRecord)=>{
                let task = this.app.task();
                task.events.emit("add", Constant.TASK_TYPE_PLAYBOOK, playbookRecord.id);
                return playbookRecord.toJson();
            });
        });
    }

    public delete(id: number, req: express.Request, res: express.Response):Promise<any>{
        let playbookModel = new PlaybookModel(this.app);
        return playbookModel.get(id).then((playbookRecord:PlaybookRecord)=>{
            if(playbookRecord.state == Constant.ING || playbookRecord.state == Constant.WAIT)
                throw new Error("playbook 执行中不允许删除");
            return playbookModel.delByKey(id).then(()=>{
                return {};
            });
        });
    }

    public restart(id: number, req: express.Request, res: express.Response):Promise<any>{
        let playbookModel = new PlaybookModel(this.app);
        return playbookModel.get(id).then((playbookRecord:PlaybookRecord)=>{
            if(playbookRecord.state == Constant.ING || playbookRecord.state != Constant.WAIT)
                throw new Error("playbook 执行中不允许重启");
            let playbookType = PlayBookFactory.getPlaybook(playbookRecord.type);
            if(!playbookType) return Promise.reject(new Error("playbook type 选择错误"));
            playbookType = new playbookType(this.app);
            playbookType.reset();
            return playbookType.save().then((playbookRecord:PlaybookRecord)=>{
                let task = this.app.task();
                task.events.emit("add", Constant.TASK_TYPE_PLAYBOOK, playbookRecord.id);
                return playbookRecord.toJson();
            });
        });
    }

    public stop(id: number, req: express.Request, res: express.Response):Promise<any>{
        let playbookModel = new PlaybookModel(this.app);
        return playbookModel.get(id).then((playbookRecord:PlaybookRecord)=>{
            if(playbookRecord.state != Constant.WAIT)
                throw new Error("playbook 排队中才允许暂停");
            let playbookType = PlayBookFactory.getPlaybook(playbookRecord.type);
            if(!playbookType) return Promise.reject(new Error("playbook type 选择错误"));
            playbookType = new playbookType(this.app);
            if(!playbookType.isRepeat())
                throw new Error("playbook 不允许暂停");
            playbookType.stop();
            return playbookType.save().then((playbookRecord:PlaybookRecord)=>{
                let task = this.app.task();
                task.events.emit("delete", Constant.TASK_TYPE_PLAYBOOK, playbookRecord.id);
                return playbookRecord.toJson();
            });
        });
    }
}