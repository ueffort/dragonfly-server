/**
 * Created by tutu on 15-12-21.
 */

/// <reference path="../../typings/protobufjs/protobufjs.d.ts" />

import CoreApp from "../App";
import * as Constant from "../Constant";
import {Promise} from "../../app/tools/Promise";
import {EventEmitter} from "events";
import {BasePlaybook} from "../playbook/BasePlaybook";
import {Playbook, PlaybookModel} from "../model/playbook";
import {Logger} from "bunyan";

export interface TaskResult{
    code:number;
    message:string;
    time?:number;
}

export default class Task {

    private static instance:Task = null;
    private app: CoreApp = null;
    private logger: Logger = null;
    private events: EventEmitter = new EventEmitter();
    private playbookList: BasePlaybook[] = [];
    private ing:boolean = false;

    constructor(app: CoreApp) {
        this.app = app;
        this.logger = this.app.logger;
    }

    public static getInstance(app: CoreApp): Task {
        if (!this.instance) {
            this.instance = new Task(app);
        }
        return this.instance;
    }

    public start(): Task {
        this.events.on("add", this.add);
        this.events.on("addTime", this.addTime);
        this.events.on("next", this.next);
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
            this.handleTask()
        });
    }

    private handleTask(){
        this.handlePlayBookTask();
    }

    private handlePlayBookTask(){
        if(this.playbookList.length > 0){
            let playbookId = Number(this.playbookList.shift());
            new PlaybookModel(this.app).get(playbookId)
                .then((playbook:Playbook)=>{
                    return new BasePlaybook(this.app, playbook).start();
                })
                .then((playbook:Playbook)=>{
                    if(playbook.time > new Date().getTime()){
                        this.events.emit("addTime", Constant.TASK_TYPE_PLAYBOOK, playbook.id, playbook.time)
                    }
                    this.events.emit("next");
                })
                .catch((error:Error)=>{
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

    private add(type: number, data:any){
        let ing = this.isDoing();
        if(type == Constant.TASK_TYPE_PLAYBOOK){
            this.playbookList.push(data)
        }
        if(!ing) this.handleTask();
    }

    private addTime(type: number, data:any, time:number){
        let nowTime = new Date().getTime();
        let _time = time - nowTime;
        if(_time > 0){
            setTimeout(()=>{
                this.events.emit("add", type, data);
            }, _time)
        }else{
            this.events.emit("add", type ,data);
        }
    }
}


