/**
 * Created by tutu on 16-3-17.
 */

///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>

import {Playbook as PlaybookRecord, PlaybookModel} from "../model/playbook";
import App from "../../app/App";
import {EventEmitter} from "events";

const WAIT:number = 1; //等待执行
const ING:number = 2; //执行中
const END:number = 3; //执行结束
const CANCEL:number = 4; //取消执行
const BREAK:number = 5; //中断执行

const SCCESS:number = 1; //执行成功
const FAIL:number = 2; //执行失败

const NORMAL:number = 1; //正常
const WARN:number = 2; //警告
const ERROR:number = 3; //错误

const UNKNOWN:number = 0; //未知

const GROUP_END:number = 1; //全部结束
const GROUP_WAIT:number = 2; //等待


export class Script{
    private name:string;
    private state:number;
    private handleState:number;
    private resultState:number;
    private params:any;
    private time:number;
    private events:EventEmitter;

    public static NAME = "n";
    public static STATE = "s";
    public static H_STATE = "hs";
    public static R_STATE = "rs";
    public static PARAMS = "p";
    public static TIME = "t";

    constructor(data:any, events:EventEmitter){
        this.events = events;
        this.events.emit("registerScript", this);
        this.name = data[Script.NAME] ? data[Script.NAME] : "";
        this.state = data[Script.STATE] ? data[Script.STATE] : UNKNOWN;
        this.handleState = data[Script.H_STATE] ? data[Script.H_STATE] : UNKNOWN;
        this.resultState = data[Script.R_STATE] ? data[Script.R_STATE] : UNKNOWN;
        this.params = data[Script.PARAMS] ? data[Script.PARAMS] : {};
        this.time = data[Script.TIME] ? data[Script.TIME] : UNKNOWN;
    }

    public getName(){
        return this.name;
    }

    public checkState(){
        return this.state;
    }

    public start(){
        this.events.emit("execScript", this.name);
    }

    private setState(state:number, handleState?:number, resultState?:number){
        this.state = state;
        if(handleState) this.handleState = handleState;
        if(resultState) this.resultState = resultState;
    }

    public end(handleState?:number, resultState?:number){
        this.setState(END, handleState, resultState);
        this.events.emit("scriptEnd");
    }

    public setParams(params:any){
        this.params = params;
    }

    public toFormat(){
        return Script.format([this.name, this.state, this.handleState, this.resultState, this.params, this.time])
    }

    public static initFormat(data:any){
        return Script.format([data[Script.NAME], WAIT, UNKNOWN, UNKNOWN, {}, UNKNOWN])
    }

    private static format(data:any){
        let n=Script.NAME,s=Script.STATE,hs=Script.H_STATE,rs=Script.R_STATE,p=Script.PARAMS,t=Script.TIME;
        let _format:any = {};
        _format[n] = data[0];
        _format[s] = data[1];
        _format[hs] = data[2];
        _format[rs] = data[3];
        _format[p] = data[4];
        _format[t] = data[5];
        return _format;
    }
}

export class ScriptGroup{
    private group:any[];
    private state:number;
    private type:number;
    private events:EventEmitter;

    public static STATE = "s";
    public static GROUP = "g";
    public static TYPE = "t";
    public static TYPE_GROUP = "tg";

    public static TYPE_LIST = 1;
    public static TYPE_PARALLEL = 2;

    constructor(data:any, events:EventEmitter){
        this.events = events;
        this.group = data[ScriptGroup.GROUP] ? data[ScriptGroup.GROUP] : [];
        this.state = data[ScriptGroup.STATE] ? data[ScriptGroup.STATE] : UNKNOWN;
        this.type = data[ScriptGroup.TYPE] ? data[ScriptGroup.TYPE] : ScriptGroup.TYPE_LIST;
        for(let i in this.group){
            if(typeof i === "object"){
                if(i[ScriptGroup.TYPE_GROUP] == 1){
                    this.group[i] = new ScriptGroup(i, events);
                }else{
                    this.group[i] = new Script(i, events);
                }
            }
        }
    }

    public start(){
        for(let i in this.group){
            if(i[ScriptGroup.TYPE_GROUP] == 1){
                if(this.group[i].checkState() != GROUP_END){
                    return this.group[i].start();
                }
            }else{
                if(this.group[i].checkState() != END){
                    this.group[i].start();
                    return true;
                }
            }
        }
        return false;
    }

    public checkState(){
        for(let i in this.group){
            if(i[ScriptGroup.TYPE_GROUP] == 1){
                if(this.group[i].checkState() != GROUP_END){
                    return this.state = GROUP_WAIT;
                }
            }else{
                if(this.group[i].checkState() != END){
                    return this.state = GROUP_WAIT;
                }
            }
        }
        return this.state = GROUP_END;
    }

    public toFormat(){
        let _group:any[] = [];
        for(let i in this.group){
            _group.push(i.toFormat());
        }
        return ScriptGroup.format([_group, this.state, this.type, 1]);
    }

    public static initFormat(data:any){
        let _group:any[] = [];
        for(let i in data[ScriptGroup.GROUP]){
            if(typeof i === "object"){
                if(i[ScriptGroup.TYPE_GROUP] == 1){
                    _group.push(ScriptGroup.initFormat(i))
                }else{
                    _group.push(Script.initFormat(i))
                }
            }
        }
        return ScriptGroup.format([_group, UNKNOWN, ScriptGroup.TYPE_LIST, 1])
    }

    private static format(data:any[]){
        let s=ScriptGroup.STATE,g=ScriptGroup.GROUP,t=ScriptGroup.TYPE,tg=ScriptGroup.TYPE_GROUP;
        let _format:any = {};
        _format[s] = data[0];
        _format[g] = data[1];
        _format[t] = data[2];
        _format[tg] = data[3];
        return _format;
    }
}

export class ScriptDispatch{
    private script:ScriptGroup = null;
    private events:EventEmitter = new EventEmitter();
    private scriptList: any = {};
    constructor(script:any){
        this.events.on("registerScript", this.registerScript);
        this.events.on("execScript",this.execScript);
        this.events.on("scriptEnd", this.scriptEnd);
        if(script[ScriptGroup.TYPE_GROUP] == 1){
            this.script = new ScriptGroup(script, this.events);
        }
    }

    private execScript(name:string){
        this.events.emit("scriptHandle", this.scriptList[name]);
    }

    private registerScript(script:Script){
        this.scriptList[script.getName()] = script;
    }

    private scriptEnd(){
        if(this.script){
            this.script.checkState();
        }
    }

    public start(){
        if(!this.doScript()){
            this.end();
        }
    }

    private end(){
        this.events.emit("end");
        this.events.removeAllListeners();
    }

    public next(){
        if(!this.doScript()){
            this.end();
        }
    }

    public setParams(scriptName:string, params:any){
        if(this.scriptList[scriptName]){
            this.scriptList[scriptName].setParams(params);
        }
    }

    private doScript(){
        if(this.script){
            if(this.script.start()){
                return true;
            }
        }
        return false;
    }

    public onEnd(callback:()=>any){
        this.events.on("end", callback)
    }

    public onHandle(callback:(script:Script)=>any){
        this.events.on("scriptHandle", callback);
    }

    public toFormat(){
        return this.script ? this.script.toFormat() : {};
    }

    public static initFormat(data:any){
        let _result = {};
        if(data[ScriptGroup.TYPE_GROUP] == 1){
            _result = ScriptGroup.initFormat(data);
        }else{
            let _initScriptGroup:any = {};
            _initScriptGroup[ScriptGroup.TYPE_GROUP] = 1;
            _initScriptGroup[ScriptGroup.GROUP] = [data];
            _result = ScriptGroup.initFormat(_initScriptGroup);
        }
        return _result;
    }
}

export class BasePlaybook{

    protected app: App;
    protected playbookRecord: PlaybookRecord;
    protected playbookModel: PlaybookModel;

    protected typeName:string;
    protected scripts:any = {};

    private scriptDispatch:ScriptDispatch;

    private scriptResolve:(value: any) => any | Thenable<any>;
    private scriptReject:(error: any) => any | Thenable<any>;

    constructor(app: App, playbook?: PlaybookRecord){
        this.app = app;
        if(playbook){
            this.playbookRecord = playbook;
        }else{
            this.playbookRecord = new PlaybookRecord();
            this.initPlaybook();

        }
        this.playbookModel = new PlaybookModel(app);
        this.doInit();
    }

    protected doInit(){
        return;
    }

    private initPlaybook(){
        this.playbookRecord.state = WAIT;
        this.playbookRecord.type = this.typeName;
        this.playbookRecord.script = ScriptDispatch.initFormat(this.scripts);
        this.playbookRecord.result = {};
    }

    public start(){
        this.scriptDispatch = new ScriptDispatch(this.playbookRecord.script);
        this.scriptDispatch.onHandle(this.handle);
        this.scriptDispatch.onEnd(this.end);
        this.scriptDispatch.start();
        return new Promise((resolve, reject)=>{
            this.scriptResolve = resolve;
            this.scriptReject = reject;
        });
    }

    private handle(script:Script){
        return Promise.resolve(this.doHandle(script)).then(()=>{
            this.scriptDispatch.next();
        });
    }

    private end(){
        this.save().then(()=>{
            this.scriptResolve(this);
        });
    }

    protected doHandle(script:Script){
        return true;
    }

    private save():Promise<any>{
        return this.playbookModel.save(this.playbookRecord);
    }

}