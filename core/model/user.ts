/**
 * Created by tutu on 16-1-21.
 */
import {Mysql} from "../../app/tools/Mysql";
import CoreApp from "../App";
import {Base, BaseModel} from "./base";
import {md5} from "../../app/tools/StringHandle";

export class User extends Base{

    public key: string = "id";

    public filed: string[] = ["id", "name", "password"];

    get id(){
        return this.get("id");
    }

    get name(){
        return this.get("name");
    }

    get password(){
        return this.get("password");
    }
}

export class UserModel extends BaseModel{

    protected tableName = "core_user";

    protected formatData(data: any){
        return new User(data);
    }

    private static formatPassword(password: string){
        return md5(password);
    }

    public login(userName: string, password: string){
        return this.getUserByName(userName, UserModel.formatPassword(password))
            .then((user: User)=>{
                return user
            });
    }

    public register(userName: string, password: string){
        let user = new User();
        user.name = userName;
        user.password = password;
        return this.add(user)
            .then((user: User)=>{
                return user
            });
    }

    private getUserByName(userName: string, password: string){
        let sql: string = "SELECT * FROM "+this.tableName+" WHERE `name` = "+userName+" and `password`="+password;
        return this.exec(sql).then((result: any[])=>{
            if(result){
                return this.formatData(result[0]);
            }else{
                throw Error("user is error");
            }
        });
    }
}