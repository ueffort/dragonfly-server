/**
 * Created by tutu on 16-2-2.
 */
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>

import {token} from "../handle/mysql";
import {Promise} from "../../app/tools/Promise";
import Controller from "../Controller";

export class Auth extends Controller{
    public static get(tokenStr:string):Promise<any>{
        return token(this.app.mysql(), tokenStr).then(function(result:any){
            return {
                token: result.token,
                email: result.email,
                state: result.state ? true : false
            }
        });
    }
}