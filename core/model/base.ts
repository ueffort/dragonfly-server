/**
 * Created by tutu on 16-1-21.
 */
import {Mysql} from "../../app/tools/Mysql";
import App from "../../app/App";

export class Base{

    private data:any;
    public key:string;
    public filed:string[];

    constructor(data?: any){
        if(data) this.data = data;
    }

    get(key: string): any{
        return this.data[key] ? this.data[key] : null;
    }

    set(key: string, val: any): any{
        this.data[key] = val;
    }
}

export class BaseModel{

    protected mysql: Mysql;
    protected tableName: string;

    public constructor(app: App){
        this.mysql = app.mysql()
    }

    protected formatData(data: any){
        return new Base(data);
    }

    public del(data: Base){
        let sql: string = "DELETE FROM "+this.tableName+" WHERE "+data.key+" = "+data.get(data.key);
        return this.exec(sql).then(()=>{return true});
    }

    public get(data: Base){
        let sql: string = "SELECT * FROM "+this.tableName+" WHERE "+data.key+" = "+data.get(data.key);
        return this.exec(sql).then((result: any[])=>{
            let newResult: any[] = [];
            for(let i=0;i<result.length;i++){
                newResult[i] = this.formatData(result[i]);
            }
            return newResult;
        });
    }

    public update(data: Base){
        let setSql = "";
        for(let i=0;i<data.filed.length;i++){
            if(data.filed[i] == data.key){
                continue;
            }
            setSql += data.filed[i]+"="+data.get(data.filed[i]);
            if(i != data.filed.length) setSql += " AND ";
        }
        let sql: string = "UPDATE "+this.tableName+" SET "+setSql+" WHERE "+data.key+" = "+data.get(data.key);
        return this.exec(sql).then(()=>{return true});
    }

    public add(data: Base){
        let vals: any[] = [];
        let keys: any[] = [];
        keys = data.filed;
        for(let i=0;i<keys.length;i++){
            if(keys[i] == data.key){
                keys.splice(i,1);
                continue;
            }
            vals.push(data.get(data.filed[i]))
        }
        let sql: string = "INSERT INTO "+this.tableName+" ("+[...keys]+") VALUES ("+[...vals]+")";
        return this.exec(sql).then((result: any)=>{data.set(data.key, result[data.key]); return data});
    }

    protected exec(sql: string){
        return this.mysql.promise(sql);
    }

}