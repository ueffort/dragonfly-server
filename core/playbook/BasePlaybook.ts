/**
 * Created by tutu on 16-3-17.
 */

import {Playbook as PlaybookRecord, PlaybookModel} from "../model/playbook";
import App from "../../app/App";

const WAIT:number = 1;
const ING:number = 2;
const END:number = 3;
const CANCEL:number = 4;
const BREAK:number = 5;

const SCCESS:number = 1;
const FAIL:number = 2;

const NORMAL:number = 1;
const WARN:number = 2;
const ERROR:number = 3;

const UNKNOWN:number = 0;

const ALL_SCCESS:number = 1;
const SOME_SCCESS:number = 2;
const ALL_FAIL:number = 3;

const SCRIPT:number = 1;
const SCRIPTGROUP:number = 2;


export class Script{
    private name:string;
    private state:number;
    private handleState:number;
    private resultState:number;
    private params:any;
    private des:string;
    private time:number;
    private result:any;

    public static NAME = "n";
    public static STATE = "s";
    public static H_STATE = "hs";
    public static R_STATE = "rs";
    public static PARAMS = "p";
    public static DES = "d";
    public static TIME = "t";

    constructor(data:any){
        this.name = data[Script.NAME] ? data[Script.NAME] : "";
        this.state = data[Script.STATE] ? data[Script.STATE] : UNKNOWN;
        this.handleState = data[Script.H_STATE] ? data[Script.H_STATE] : UNKNOWN;
        this.resultState = data[Script.R_STATE] ? data[Script.R_STATE] : UNKNOWN;
        this.params = data[Script.PARAMS] ? data[Script.PARAMS] : {};
        this.des = data[Script.DES] ? data[Script.DES] : "";
        this.time = data[Script.TIME] ? data[Script.TIME] : UNKNOWN;
    }

    public handle(action:(name:string, params:any)=>Promise<any>){
        action(this.name, this.params);
    }

    public setState(state:number, handleState?:number, resultState?:number){
        this.state = state;
        if(handleState) this.handleState = handleState;
        if(resultState) this.resultState = resultState;
    }

    public setParams(params:any){
        this.params = params;
    }

    public toFormat(){
        return Script.format([this.name, this.state, this.handleState, this.resultState, this.params, this.des, this.time])
    }

    public static initFormat(data:any){
        return Script.format([data[Script.NAME], WAIT, UNKNOWN, UNKNOWN, {}, data[Script.DES], UNKNOWN])
    }

    private static format(data:any){
        let n=Script.NAME,s=Script.STATE,hs=Script.H_STATE,rs=Script.R_STATE,p=Script.PARAMS,d=Script.DES,t=Script.TIME;
        let _format:any = {};
        _format[n] = data[0];
        _format[s] = data[1];
        _format[hs] = data[2];
        _format[rs] = data[3];
        _format[p] = data[4];
        _format[d] = data[5];
        _format[t] = data[6];
        return _format;
    }
}

export class ScriptGroup{
    private group:any[];
    private state:number;
    private type:number;
    private num:number;

    public static STATE = "s";
    public static GROUP = "g";
    public static TYPE = "t";
    public static TYPE_GROUP = "tg";

    public static TYPE_LIST = 1;
    public static TYPE_PARALLEL = 2;

    constructor(data:any){
        this.group = data[ScriptGroup.GROUP] ? data[ScriptGroup.GROUP] : [];
        this.state = data[ScriptGroup.STATE] ? data[ScriptGroup.STATE] : UNKNOWN;
        this.type = data[ScriptGroup.TYPE] ? data[ScriptGroup.TYPE] : ScriptGroup.TYPE_LIST;
        for(let i in this.group){
            if(typeof i === "object"){
                if(i[ScriptGroup.TYPE_GROUP] == 1){
                    this.group[i] = new ScriptGroup(i);
                }else{
                    this.group[i] = new Script(i);
                }
            }
        }
    }

    public start(){
        
    }

    public toFormat(){
        let _group:any[] = [];
        for(let i in this.group){
            _group.push(i.toFormat())
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
    constructor(script:any){
        if(script[ScriptGroup.TYPE_GROUP] == 1){
            this.script = new ScriptGroup(script)
        }
    }

    public start(){

    }

    public end(){

    }

    public next(){

    }

    public toFormat(){
        return this.script ? this.script.toFormat() : {};
    }

    public static initFormat(data:any){
        let _result = {};
        if(data[ScriptGroup.TYPE_GROUP] == 1){
            _result = ScriptGroup.initFormat(data);
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

    constructor(app: App, playbook?: PlaybookRecord){
        this.app = app;
        if(playbook){
            this.playbookRecord = playbook;
        }else{
            this.playbookRecord = new PlaybookRecord();
            this.initPlaybook();

        }
        this.playbookModel = new PlaybookModel(app);
        this.init();
    }

    protected init(){

    }

    private initPlaybook(){
        this.playbookRecord.state = WAIT;
        this.playbookRecord.type = this.typeName;
        this.playbookRecord.script = ScriptDispatch.initFormat(this.scripts);
        this.playbookRecord.result = {};
    }

    public start(){
        this.scriptDispatch = new ScriptDispatch(this.playbookRecord.script);
    }

    private save(){
        return this.playbookModel.save(this.playbookRecord);
    }

    private next(){

    }

    private done(){

    }

    protected scriptHandleResult(scriptName:string, params: any, result:any){
        return result;
    }

}