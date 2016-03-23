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

    public playbookSetting(type: string = "Base", req: express.Request, res: express.Response):Promise<any>{
        let playbook:BasePlaybook = PlayBookFactory.getPlaybook(this.app, type);
        let setting = playbook.getPlaybookInfo();
        return Promise.resolve(setting);
    }

    public playbookStatus(id: number, req: express.Request, res: express.Response):Promise<any>{
        let playbookModel = new PlaybookModel(this.app);
        return playbookModel.get(id).then((playbookRecord:PlaybookRecord)=>{
            return playbookRecord.toJson();
        });
    }

    public playbookList(num: number = 20, start: number = 0, count: boolean = false, req: express.Request, res: express.Response):Promise<any>{
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

    public playbookAdd(type: string, param: any, req: express.Request, res: express.Response):Promise<any>{
        let playbook:BasePlaybook = PlayBookFactory.getPlaybook(this.app, type);
        playbook.setParam(param);
        return playbook.save().then((playbookRecord:PlaybookRecord)=>{
            let task = this.app.task();
            task.events.emit("add", Constant.TASK_TYPE_PLAYBOOK, playbookRecord.id);
            return playbookRecord.toJson();
        });
    }

    public playbookUpdate(id: number, param: any, req: express.Request, res: express.Response):Promise<any>{
        let playbookModel = new PlaybookModel(this.app);
        return playbookModel.get(id).then((playbookRecord:PlaybookRecord)=>{
            if(playbookRecord.state == Constant.ING || playbookRecord.state == Constant.WAIT)
                throw new Error("playbook 执行中不允许修改");
            let playbook:BasePlaybook = PlayBookFactory.getPlaybook(this.app, playbookRecord.type);
            playbook.setParam(param).reset();
            return playbook.save().then((playbookRecord:PlaybookRecord)=>{
                let task = this.app.task();
                task.events.emit("add", Constant.TASK_TYPE_PLAYBOOK, playbookRecord.id);
                return playbookRecord.toJson();
            });
        });
    }

    public playbookDelete(id: number, req: express.Request, res: express.Response):Promise<any>{
        let playbookModel = new PlaybookModel(this.app);
        return playbookModel.get(id).then((playbookRecord:PlaybookRecord)=>{
            if(playbookRecord.state == Constant.ING || playbookRecord.state == Constant.WAIT)
                throw new Error("playbook 执行中不允许删除");
            return playbookModel.delByKey(id).then(()=>{
                return {};
            });
        });
    }

    public playbookRestart(id: number, req: express.Request, res: express.Response):Promise<any>{
        let playbookModel = new PlaybookModel(this.app);
        return playbookModel.get(id).then((playbookRecord:PlaybookRecord)=>{
            if(playbookRecord.state == Constant.ING || playbookRecord.state != Constant.WAIT)
                throw new Error("playbook 执行中不允许重启");
            let playbook:BasePlaybook = PlayBookFactory.getPlaybook(this.app, playbookRecord.type);
            playbook.reset();
            return playbook.save().then((playbookRecord:PlaybookRecord)=>{
                let task = this.app.task();
                task.events.emit("add", Constant.TASK_TYPE_PLAYBOOK, playbookRecord.id);
                return playbookRecord.toJson();
            });
        });
    }

    public playbookStop(id: number, req: express.Request, res: express.Response):Promise<any>{
        let playbookModel = new PlaybookModel(this.app);
        return playbookModel.get(id).then((playbookRecord:PlaybookRecord)=>{
            if(playbookRecord.state != Constant.WAIT)
                throw new Error("playbook 排队中才允许暂停");
            let playbook:BasePlaybook = PlayBookFactory.getPlaybook(this.app, playbookRecord.type);
            if(!playbook.isRepeat())
                throw new Error("playbook 不允许暂停");
            playbook.stop();
            return playbook.save().then((playbookRecord:PlaybookRecord)=>{
                let task = this.app.task();
                task.events.emit("delete", Constant.TASK_TYPE_PLAYBOOK, playbookRecord.id);
                return playbookRecord.toJson();
            });
        });
    }
}