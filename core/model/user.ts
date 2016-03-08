/**
 * Created by tutu on 16-1-21.
 */
import {Mysql} from "../../app/tools/Mysql";
import CoreApp from "../App";
import {Base, BaseModel} from "./base";
import {md5} from "../../app/tools/StringHandle";

export class User extends Base{

    get id(){
        return this.get("id");
    }

    get email(){
        return this.get("email");
    }

    get password(){
        return this.get("password");
    }
}

export class UserModel extends BaseModel{

    protected tableName = "core_user";

    public key: string = "id";

    public filed: string[] = ["id", "email", "password", "state", "create_time", "update_time", "delete_time"];

    protected formatData(data: any){
        return new User(data);
    }

    private static formatPassword(password: string){
        return md5(password);
    }

    public login(email: string, password: string){
        return this.getUserByName(email, UserModel.formatPassword(password))
            .then((user: User)=>{
                return user
            });
    }

    public register(email: string, password: string){
        let user = new User();
        user.email = email;
        user.password = UserModel.formatPassword(password);
        return this.add(user)
            .then((user: User)=>{
                return user
            });
    }

    private getUserByName(email: string, password: string){
        let sql: string = "SELECT * FROM "+this.tableName+" WHERE `email` = '"+email+"' and `password`='"+password+"' and "+this.deleteTime+"<= 0";
        return this.exec(sql).then((result: any[])=>{
            if(result.length > 0){
                return this.formatData(result[0]);
            }else{
                throw Error("email or password is error");
            }
        });
    }
}