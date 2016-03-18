/**
 * Created by tutu on 16-1-21.
 */
import {Mysql} from "../../app/tools/Mysql";
import App from "../../app/App";
import {BaseModel, ModelHandle} from "./BaseModel";

export class Record{

    private data:any = {};

    constructor(data?: any){
        if(data) this.data = data;
    }

    get(key: string): any{
        return this.data[key] ? this.data[key] : "";
    }

    set(key: string, val: any): any{
        this.data[key] = val;
    }
}

export class Model extends BaseModel{

    protected tableName: string;
    protected key:string = "id";
    protected createTime:string = "create_time";
    protected updateTime:string = "update_time";
    protected deleteTime:string = "delete_time";
    protected filed:string[];

    protected formatData(data: any):Record{
        return new Record(data);
    }

    public del(data: Record):Promise<any>{
        data.set(this.deleteTime, BaseModel.getTime());
        return this.update(data);
    }

    public get(key: number):Promise<any>{
        let modelHandle: ModelHandle = {
            tableName: this.tableName,
            select: true,
            where: [[this.key, "=", key]]
        };
        return this.handle(modelHandle).then((result: any[])=>{
            if(!result || result.length <= 0) return {};
            return this.formatData(result[0]);
        });
    }

    public update(data: Record):Promise<any>{
        data.set(this.updateTime, BaseModel.getTime());
        let keys: any[] = this.filed;
        let values: any = {};
        for(let i=0;i<keys.length;i++){
            if(keys[i] == this.key){
                keys.splice(i,1);
                continue;
            }
            values[keys[i]] = data.get(keys[i]);
        }
        let modelHandle: ModelHandle = {
            tableName: this.tableName,
            update: true,
            value: values,
            filed: keys,
            where: [[this.key, "=", data.get(this.key)]]
        };
        return this.handle(modelHandle).then(()=>{return true});
    }

    public add(data: Record):Promise<any>{
        data.set(this.createTime, BaseModel.getTime());
        let keys: any[] = this.filed;
        let values: any = {};
        for(let i=0;i<keys.length;i++){
            if(keys[i] == this.key){
                keys.splice(i,1);
                continue;
            }
            values[keys[i]] = data.get(keys[i]);
        }
        let modelHandle: ModelHandle = {
            tableName: this.tableName,
            add: true,
            value: values,
            filed: keys
        };
        return this.handle(modelHandle).then((result: any)=>{data.set(this.key, result[this.key]); return data});
    }

    public save(data: Record):Promise<any>{
        if(data.get(this.createTime)){
            return this.update(data);
        }else{
            return this.add(data);
        }

    }

}