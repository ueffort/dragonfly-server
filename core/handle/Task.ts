/**
 * Created by tutu on 15-12-21.
 */

/// <reference path="../../typings/protobufjs/protobufjs.d.ts" />

import CoreApp from "../App";
import * as Constant from "../Constant";
import {Promise} from "../../app/tools/Promise";
import {EventEmitter} from "events";
import {Base as BasePlaybook} from "../playbook/Base";
import {Playbook, PlaybookModel} from "../model/playbook";
import {Logger} from "bunyan";
import {getTime} from "../../app/tools/Util";
import {Factory as PlaybookFactory} from "../playbook/Factory";

export default class Task {

    private static instance: Task = null;
    private app: CoreApp = null;
    private logger: Logger = null;
    public events: EventEmitter = new EventEmitter();
    private playbookList: BasePlaybook[] = [];
    private timeList: any = {};
    private ing: boolean = false;

    constructor(app: CoreApp){
        this.app = app;
        this.logger = this.app.logger;
    }

    public static getInstance(app:CoreApp): Task{
        if (!this.instance) {
            this.instance = new Task(app);
        }
        return this.instance;
    }

    public start():Task{
        this.events.on("add", this.add.bind(this));
        this.events.on("delete", this.del.bind(this));
        this.events.on("addTime", this.addTime.bind(this));
        this.events.on("next", this.next.bind(this));
        this.init();
        return this;
    }

    private init(){
        let playbookModel = new PlaybookModel(this.app);
        playbookModel.getWaitPlayBook().then((playbookList:Playbook[])=>{
            for(let i in playbookList){
                if(playbookList[i].time > 0){
                    this.events.emit("addTime", Constant.TASK_TYPE_PLAYBOOK, playbookList[i].id, playbookList[i].time);
                }else{
                    this.events.emit("add", Constant.TASK_TYPE_PLAYBOOK, playbookList[i].id);
                }
            }
        });
    }

    private handleTask(){
        this.handlePlayBookTask();
    }

    private handlePlayBookTask(){
        if(this.playbookList.length > 0){
            let playbookId = Number(this.playbookList.shift());
            new PlaybookModel(this.app).get(playbookId)
                .then((playbook: Playbook)=>{
                    if(!PlaybookFactory.isHasPlaybook(playbook.type)) return Promise.reject(new Error("playbook type 不存在"));
                    let playbookType = PlaybookFactory.getPlaybook(playbook.type);
                    if(!playbookType) return Promise.reject(new Error("playbook type 选择错误"));
                    playbookType = new playbookType(this.app);
                    return new playbookType(this.app, playbook).start();
                })
                .then((playbook: Playbook)=>{
                    if(playbook.time > getTime()){
                        this.events.emit("addTime", Constant.TASK_TYPE_PLAYBOOK, playbook.id, playbook.time)
                    }
                    this.events.emit("next");
                })
                .catch((error: Error)=>{
                    this.events.emit("next");
                });
            this.ing = true;
        }else{
            this.ing = false;
        }
    }

    private next(){
        this.handleTask();
    }

    private isDoing(){
        return this.ing;
    }

    private del(type: number, data: any){
        //if(type == Constant.TASK_TYPE_PLAYBOOK){
        //    let index = this.playbookList.indexOf(data);
        //    if(index > 0) this.playbookList.splice(this.playbookList.indexOf(data), 1);
        //}
        let timeIndex = this.getTimeIndex(type, data);
        let timeKey = this.timeList[this.getTimeIndex(type, data)];
        clearTimeout(timeKey);
        delete this.timeList[timeIndex];
    }

    private add(type: number, data: any){
        let ing = this.isDoing();
        if(type == Constant.TASK_TYPE_PLAYBOOK){
            this.playbookList.push(data)
        }
        if(!ing) this.handleTask();
    }

    private addTime(type: number, data: any, time: number){
        let nowTime = getTime();
        let _time = time - nowTime;
        if(_time > 0){
            let timeKey = setTimeout(()=>{
                this.events.emit("add", type, data);
                delete this.timeList[this.getTimeIndex(type, data)];
            }, _time);
            this.timeList[this.getTimeIndex(type, data)] = timeKey;
        }else{
            this.events.emit("add", type ,data);
        }
    }

    private getTimeIndex(type: number, data: any){
        if(type == Constant.TASK_TYPE_PLAYBOOK){
            return data;
        }
    }
}


