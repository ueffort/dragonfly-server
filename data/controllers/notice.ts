/**
 * Created by tutu on 16-2-2.
 */
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>

import {token} from "../handle/mysql";
import {Promise} from "../../app/tools/Promise";
import Controller from "../../app/abstract/Controller";

export class Notice extends Controller{
    public static post(subject:string, body:string, to:string):Promise<any>{
        return this.app.email().send(subject, body, [to]);
    }
}
