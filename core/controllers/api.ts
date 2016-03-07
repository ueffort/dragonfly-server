/**
 * Created by tutu on 16-2-2.
 */
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>

import {Promise} from "../../app/tools/Promise";
import Controller from "../Controller";
import {UserModel} from "../model/user";

export class Api extends Controller{
    public static login(name: string, password: string):Promise<any>{
        return new UserModel(Api.app).login(name, password);
    }

    public static register(name: string, password: string):Promise<any>{
        return new UserModel(Api.app).register(name, password);
    }
}