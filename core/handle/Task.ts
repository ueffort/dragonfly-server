/**
 * Created by tutu on 15-12-21.
 */

/// <reference path="../../typings/protobufjs/protobufjs.d.ts" />

import CoreApp from "../App";
import {Promise} from "../../app/tools/Promise";
import {EventEmitter} from "events";
import {BasePlaybook} from "../playbook/BasePlaybook";
import {Playbook as PlaybookRecord, PlaybookModel} from "../model/playbook";

export const PLAYBOOK = 1;

export default class Task {

    private static instance:Task = null;
    private app: CoreApp = null;
    private events: EventEmitter = new EventEmitter();
    private playbookList: BasePlaybook[] = [];
    private waitTime: number = 1000*60;

    constructor(app: CoreApp) {
        this.app = app;
    }

    public static getInstance(app: CoreApp): Task {
        if (!this.instance) {
            this.instance = new Task(app);
        }
        return this.instance;
    }

    public start(): Task {
        this.events.on("add", this.add);
        this.events.on("next", this.next);
        this.handleTask();
        return this;
    }

    private handleTask(){
        this.handlePlayBookTask();
    }

    private handlePlayBookTask(){
        if(this.playbookList.length > 0){
            let playbookId = Number(this.playbookList.pop());
            new PlaybookModel(this.app).get(playbookId)
                .then((playbook:PlaybookRecord)=>{
                    new BasePlaybook(this.app, playbook).start()
                        .then(()=>{
                            this.events.emit("next");
                        });
                });
        }else{
            setTimeout(this.handleTask, this.waitTime);
        }
    }

    private next(){
        this.handleTask();
    }

    private add(type: number, data:any){
        if(type == PLAYBOOK){
            this.playbookList.push(data)
        }
    }
}


