/**
 * Created by tutu on 16-1-21.
 */
import {Mysql} from "../../app/tools/Mysql";
import App from "../../app/App";

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

export class Model{

    protected mysql: Mysql;
    protected tableName: string;
    protected key:string = "id";
    protected createTime:string = "create_time";
    protected updateTime:string = "update_time";
    protected deleteTime:string = "delete_time";
    protected filed:string[];

    public constructor(app: App){
        this.mysql = app.mysql()
    }

    protected formatData(data: any){
        return new Record(data);
    }

    private getTime(){
        return new Date().getTime();
    }

    public del(data: Record){
        data.set(this.deleteTime, this.getTime);
        return this.update(data);
    }

    public get(data: Record){
        let sql: string = "SELECT * FROM "+this.tableName+" WHERE "+this.key+" = "+data.get(this.key)+" AND "+this.deleteTime+"<=0";
        return this.exec(sql).then((result: any[])=>{
            let newResult: any[] = [];
            for(let i=0;i<result.length;i++){
                newResult[i] = this.formatData(result[i]);
            }
            return newResult;
        });
    }

    public update(data: Record){
        data.set(this.updateTime, this.getTime);
        let setSql = "";
        for(let i=0;i<this.filed.length;i++){
            if(this.filed[i] == this.key){
                continue;
            }
            setSql += this.filed[i]+"="+data.get(this.filed[i]);
            if(i != this.filed.length) setSql += " AND ";
        }
        let sql: string = "UPDATE "+this.tableName+" SET "+setSql+" WHERE "+this.key+" = "+data.get(this.key);
        return this.exec(sql).then(()=>{return true});
    }

    public add(data: Record){
        data.set(this.createTime, this.getTime);
        let vals: any[] = [];
        let keys: any[] = [];
        keys = this.filed;
        for(let i=0;i<keys.length;i++){
            if(keys[i] == this.key){
                keys.splice(i,1);
                continue;
            }
            vals.push(data.get(this.filed[i]))
        }
        let sql: string = "INSERT INTO "+this.tableName+" ("+[...keys]+") VALUES ('"+[...vals]+"')";
        return this.exec(sql).then((result: any)=>{data.set(this.key, result[this.key]); return data});
    }

    protected exec(sql: string){
        console.log(sql);
        return this.mysql.promise(sql);
    }

}