/**
 * Created by tutu on 16-2-2.
 */
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>

import {Promise} from "../../app/tools/Promise";
import Controller from "../Controller";
import {UserModel} from "../model/user";
import {User} from "../model/user";

export class Api extends Controller{
    public static login(email: string, password: string):Promise<any>{
        return new UserModel(this.app).login(email, password)
            .then((user: User)=>{
                return Api.formatResult({email: user.email});
            });
    }

    public static register(email: string, password: string):Promise<any>{
        return new UserModel(this.app).register(email, password)
            .then((user: User)=>{
                return Api.formatResult({email: user.email});
            });
    }

    public static formatResult(data: any){
        return {status: 200, message: "success", data: data}
    }
}