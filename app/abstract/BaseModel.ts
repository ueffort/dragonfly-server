/**
 * Created by tutu on 16-1-21.
 */
import {Mysql} from "../../app/tools/Mysql";
import App from "../../app/App";

export interface ModelHandle{
    select?:boolean;
    add?:boolean;
    update?:boolean;

    tableName:string;
    where?:any[];
    filed?:string[];
    value?:any;
}

export class BaseModel{

    protected mysql: Mysql;
    protected app: App;

    public constructor(app: App){
        this.app = app;
        this.mysql = app.mysql()
    }

    public static getTime():number{
        return new Date().getTime();
    }

    protected exec(sql: string):Promise<any>{
        console.log(sql);
        return this.mysql.promise(sql);
    }

    protected handle(modelHandle: ModelHandle):Promise<any>{
        let sql = "";
        let error = "";
        if(modelHandle.add){
            if(!modelHandle.value && !modelHandle.filed) error = "[DB] INSERT SQL value and filed not empty";
            sql = `INSERT INTO ${modelHandle.tableName} ${this._addValue(modelHandle.value, modelHandle.filed)}`;
        }else if(modelHandle.select){
            if(!modelHandle.where) error = "[DB] SELECT SQL where not empty";
            sql = `SELECT ${this._filed(modelHandle.filed)} FROM ${modelHandle.tableName} WHERE ${this._where(modelHandle.where)}`;
        }else if(modelHandle.update){
            if(!modelHandle.where || !modelHandle.value) error = "[DB] UPDATE SQL where or value not empty";
            sql = `UPDATE ${modelHandle.tableName} SET ${this._setValue(modelHandle.value, modelHandle.filed)} WHERE ${this._where(modelHandle.where)}`;
        }else{
            error = "[DB] SQL TYPE not empty"
        }
        if(error) return Promise.reject(new Error(`${error} ERROR SQL: ${sql}`));
        return this.exec(sql);
    }

    private _v(v:any){
        let _v:any = "";
        if(typeof v === "string"){
            _v = `'${v}'`;
        }else if(typeof v === "number"){
            _v = v;
        }
        return _v;
    }

    private _f(f:any){
        return `\`${f}\``;
    }

    private _addValue(value:any={}, filed:string[]=[]):string{
        let tmp:any[] = [];
        let filedTmp:any[] = [];
        if(filed.length>0){
            for(let i in filed){
                let v = value[filed[i]] ? value[filed[i]] : "";
                if (v){
                    filedTmp.push(this._f(filed[i]));
                    tmp.push(this._v(v));
                }
            }
        }else{
            for(let i in value){
                filedTmp.push(this._f(i));
                tmp.push(this._v(value[i]));
            }
        }
        return `(${filedTmp.join(",")}) VALUES (${tmp.join(",")})`;
    }

    private _setValue(value:any={}, filed:string[]=[]):string{
        let tmp:any[] = [];
        if(filed.length>0){
            for(let i in filed){
                let v = value[filed[i]] ? value[filed[i]] : "";
                if (v){
                    tmp.push(`${this._f(filed[i])}=${this._v(v)}`);
                }
            }
        }else{
            for(let i in value){
                tmp.push(`${this._f(i)}=${this._v(value[i])}`);
            }
        }
        return tmp.join(",");
    }

    private _filed(filed:any[]=[]):string{
        return filed.length>0 ? filed.join(",") : "*";
    }

    private _where(where:any[]=[]):string{
        let tmp:any[] = [];
        for(let i in where){
            if(typeof where[i] === "string"){
                tmp.push(where[i]);
            }else if(typeof where[i] === "object"){
                tmp.push(`${this._f(where[i][0])}${where[i][1]}${this._v(where[i][2])}`);
            }
        }
        return tmp.join(" AND ");
    }

}