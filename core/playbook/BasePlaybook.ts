/**
 * Created by tutu on 16-3-17.
 */

///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>

import {Playbook, PlaybookModel} from "../model/playbook";
import CoreApp from "../App";
import * as Constant from "../Constant";
import {EventEmitter} from "events";
import {TaskResult} from "../handle/Task";
import {END} from "../Constant";

export class Script{
    private name:string;
    private state:number;
    private handleState:number;
    private resultState:number;
    private params:any;
    private overTime:number;
    private events:EventEmitter;

    public static NAME = "n";
    public static STATE = "s";
    public static H_STATE = "hs";
    public static R_STATE = "rs";
    public static PARAMS = "p";
    public static OVER_TIME = "ot";

    constructor(data:any, events:EventEmitter){
        this.events = events;
        this.events.emit("registerScript", this);
        this.name = data[Script.NAME] ? data[Script.NAME] : "";
        this.state = data[Script.STATE] ? data[Script.STATE] : Constant.WAIT;
        this.handleState = data[Script.H_STATE] ? data[Script.H_STATE] : Constant.UNKNOWN;
        this.resultState = data[Script.R_STATE] ? data[Script.R_STATE] : Constant.UNKNOWN;
        this.params = data[Script.PARAMS] ? data[Script.PARAMS] : {};
        this.overTime = data[Script.OVER_TIME] ? data[Script.OVER_TIME] : Constant.UNKNOWN;
    }

    public getName(){
        return this.name;
    }

    public checkState(){
        return this.state;
    }

    public start(){
        this.setState(Constant.ING);
        this.events.emit("execScript", this.name);
    }

    public cancel(){
        if(this.state != Constant.END || this.state != Constant.BREAK){
            this.setState(Constant.CANCEL)
        }
    }

    public error(){
        if(this.state != Constant.END){
            this.setState(Constant.BREAK, Constant.FAIL)
        }
    }

    private setState(state:number, handleState?:number, resultState?:number){
        this.state = state;
        if(handleState) this.handleState = handleState;
        if(resultState) this.resultState = resultState;
    }

    public end(resultState?:number){
        this.setState(Constant.END, Constant.SUCCESS, resultState);
        this.events.emit("scriptSaveEnd");
    }

    public setParams(params:any){
        this.params = params;
    }

    public toFormat(){
        return Script.format([this.name, this.state, this.handleState, this.resultState, this.params, this.overTime])
    }

    public static initFormat(data:any){
        return Script.format([data["name"], Constant.WAIT, Constant.UNKNOWN, Constant.UNKNOWN, {}, Constant.UNKNOWN])
    }

    private static format(data:any){
        let n=Script.NAME,s=Script.STATE,hs=Script.H_STATE,rs=Script.R_STATE,p=Script.PARAMS,ot=Script.OVER_TIME;
        let _format:any = {};
        _format[n] = data[0];
        _format[s] = data[1];
        _format[hs] = data[2];
        _format[rs] = data[3];
        _format[p] = data[4];
        _format[ot] = data[5];
        return _format;
    }
}

export class ScriptGroup{
    private group:any[];
    private state:number;
    private type:number;
    private events:EventEmitter;

    public static STATE = "s";
    public static LIST = "l";
    public static TYPE = "t";

    public static TYPE_LIST = 1;
    public static TYPE_PARALLEL = 2;

    constructor(data:any, events:EventEmitter){
        this.events = events;
        this.group = data[ScriptGroup.LIST] ? data[ScriptGroup.LIST] : [];
        this.state = data[ScriptGroup.STATE] ? data[ScriptGroup.STATE] : Constant.WAIT;
        this.type = data[ScriptGroup.TYPE] ? data[ScriptGroup.TYPE] : ScriptGroup.TYPE_LIST;
        for(let i in this.group){
            if(typeof i === "object"){
                if(i[ScriptGroup.LIST]){
                    this.group[i] = new ScriptGroup(i, events);
                }else{
                    this.group[i] = new Script(i, events);
                }
            }
        }
    }

    public start(){
        for(let i in this.group){
            if(i[ScriptGroup.LIST]){
                if(this.group[i].checkState() == Constant.GROUP_WAIT || this.group[i].checkState() == Constant.GROUP_ING){
                    return this.group[i].start();
                }
            }else{
                if(this.group[i].checkState() == Constant.WAIT){
                    this.group[i].start();
                    return true;
                }
            }
        }
        return false;
    }

    public cancel(){
        if(this.state != Constant.GROUP_END){
            this.state = Constant.GROUP_CANCEL
        }
        for(let i in this.group){
            this.group[i].cancel();
        }
    }

    public checkState(){
        if(this.state == Constant.GROUP_CANCEL) return this.state;
        let end:number = 0;
        let wait:number = 0;
        for(let i in this.group){
            let state = this.group[i].checkState();
            if(this.group[i][ScriptGroup.LIST]){
                if(state == Constant.GROUP_END){
                    end++;
                }else{
                    wait++;
                }
            }else{
                if(state == Constant.END){
                    end++;
                }else{
                    wait++;
                }
            }
        }
        if(end == 0) this.state = Constant.GROUP_WAIT;
        if(wait == 0) this.state = Constant.GROUP_END;
        if(end > 1 && wait != 0) this.state = Constant.GROUP_ING;
        return this.state;
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
        for(let i in data["list"]){
            if(typeof i === "object"){
                if(i["list"]){
                    _group.push(ScriptGroup.initFormat(i))
                }else{
                    _group.push(Script.initFormat(i))
                }
            }
        }
        return ScriptGroup.format([_group, Constant.GROUP_WAIT, ScriptGroup.TYPE_LIST, 1])
    }

    private static format(data:any[]){
        let s=ScriptGroup.STATE,l=ScriptGroup.LIST,t=ScriptGroup.TYPE;
        let _format:any = {};
        _format[s] = data[0];
        _format[l] = data[1];
        _format[t] = data[2];
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
        this.events.on("scriptSaveEnd", this.scriptSaveEnd);
        if(script[ScriptGroup.LIST]){
            this.script = new ScriptGroup(script, this.events);
        }
    }

    private execScript(name:string){
        this.events.emit("scriptHandle", this.getScript(name));
    }

    private registerScript(script:Script){
        this.scriptList[script.getName()] = script;
    }

    private scriptSaveEnd(){
        if(this.script){
            if(this.script.checkState() == Constant.GROUP_END){
                this.events.emit("scriptEnd");
            }
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

    public cancel(error?:Error){
        if(this.script){
            this.script.cancel();
        }
        this.events.emit("cancel", error);
        this.events.removeAllListeners();
    }

    public next(){
        if(!this.doScript()){
            this.end();
        }
    }

    public scriptEnd(scriptName:string, resultState:number){
        this.getScript(scriptName).end(resultState);
    }

    public scriptError(name:string, error:Error){
        this.getScript(name).error();
        this.cancel(error);
    }

    public getScript(name:string){
        return this.scriptList[name]
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

    public onScriptHandle(callback:(script:Script)=>any){
        this.events.on("scriptHandle", callback);
    }

    public onEnd(callback:()=>any){
        this.events.on("end", callback)
    }

    public onCancel(callback:(error?:Error)=>any){
        this.events.on("cancel", callback);
    }

    public onScriptEnd(callback:(script:Script)=>any){
        this.events.on("scriptSaveEnd", callback);
    }

    public toFormat(){
        return this.script ? this.script.toFormat() : {};
    }

    public static initFormat(data:any){
        let _result = {};
        if(data["list"]){
            _result = ScriptGroup.initFormat(data);
        }else{
            let _initScriptGroup:any = {};
            _initScriptGroup["list"] = [data];
            _result = ScriptGroup.initFormat(_initScriptGroup);
        }
        return _result;
    }
}

export interface ScriptResult{
    state:number;
    handleState:number;
    resultState:number;
    data:any;
    command:number;
}

export class BasePlaybook{

    protected app: CoreApp;
    protected playbook: Playbook;
    protected playbookModel: PlaybookModel;

    protected typeName:string = "base";
    protected scripts:any = {};
    protected repeat:boolean = false;
    protected repeatTime:number = 0;

    private scriptDispatch:ScriptDispatch;

    private scriptResolve:(value: any) => any | Thenable<any>;
    private scriptReject:(error: any) => any | Thenable<any>;

    private scriptHandleFun:(script: Script) => Promise<ScriptResult>;

    constructor(app: CoreApp, playbook?: Playbook){
        this.app = app;
        if(playbook){
            this.playbook = playbook;
        }else{
            this.playbook = new Playbook();
            this.initPlaybook();

        }
        this.playbookModel = new PlaybookModel(app);
        this.setHandleFun(BasePlaybook.doHandle);
    }

    protected doInit(){
        return;
    }

    private setHandleFun(fun:(script: Script) => Promise<ScriptResult>){
        this.scriptHandleFun = fun;
    }

    private initPlaybook(){
        this.playbook.state = Constant.WAIT;
        this.playbook.type = this.typeName;
        this.playbook.script = ScriptDispatch.initFormat(this.scripts);
        this.playbook.result = {};
        this.playbook.time = 0;
        this.doInit();
    }

    public start(){
        this.scriptDispatch = new ScriptDispatch(this.playbook.script);
        this.scriptDispatch.onScriptHandle(this.scriptHandle);
        this.scriptDispatch.onEnd(this.end);
        this.scriptDispatch.onCancel(this.cancel);
        this.scriptDispatch.onScriptEnd(this.scriptEnd);
        this.scriptDispatch.start();
        this.playbook.state = Constant.ING;
        return new Promise((resolve, reject)=>{
            this.scriptResolve = resolve;
            this.scriptReject = reject;
        });
    }

    private addResult(scriptName:string, result:any){
        this.playbook.result[scriptName] = result;
    }

    protected getResult(scriptName:string){
        return this.playbook.result[scriptName];
    }

    private scriptHandle(script:Script){
        return Promise.resolve(this.scriptHandleFun(script))
            .then((result:ScriptResult)=>{
                this.addResult(script.getName(), result.data);
                this.scriptDispatch.scriptEnd(script.getName(), result.resultState);
                if(result.command == Constant.SCRIPT_CANCEL_COMMAND){
                    this.scriptDispatch.cancel();
                }else{
                    this.scriptDispatch.next();
                }
            })
            .catch((error:Error)=>{
                this.addResult(script.getName(), error);
                this.scriptDispatch.scriptError(script.getName(), error);
            });
    }

    private saveScript(){
        this.playbook.script = this.scriptDispatch.toFormat();
        return this.save();
    }

    private scriptEnd(){
        return this.saveScript();
    }

    private end(){
        let result:TaskResult = {
            code:Constant.TASK_OVER,
            message:"脚本完成"
        };
        this.playbook.state = Constant.END;

        if(this.repeat){
            this.playbook.state = Constant.WAIT;
            this.playbook.script = ScriptDispatch.initFormat(this.scripts);
            this.playbook.time = this.playbook.time + this.repeatTime;
            result["time"] = this.playbook.time;
            result["code"] = Constant.TASK_AGAIN;
        }

        this.saveScript().then(()=>{
            this.scriptResolve(result);
        });
    }

    private cancel(error?:Error){
        if(!error){
            this.playbook.state = Constant.CANCEL;
            let result:TaskResult = {
                code:Constant.TASK_CANCEL,
                message:"脚本中断"
            };
            this.saveScript().then(()=>{
                this.scriptResolve(result);
            });
        }else{
            this.playbook.state = Constant.BREAK;
            this.saveScript().then(()=>{
                this.scriptReject(error);
            });
        }
    }

    private static doHandle(script:Script):Promise<ScriptResult>{
        let result:ScriptResult = {
            state: Constant.END,
            handleState: Constant.SUCCESS,
            resultState: Constant.NORMAL,
            command: Constant.SCRIPT_NEXT_COMMAND,
            data: {}
        };
        return Promise.resolve(result);
    }

    private save():Promise<any>{
        return this.playbookModel.save(this.playbook);
    }

}