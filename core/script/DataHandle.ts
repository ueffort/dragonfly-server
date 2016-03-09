/**
 * Created by tutu on 16-3-9.
 */

/// <reference path="../../libs/ts/request.d.ts" />

import * as request from 'request';
import ServerAjax from "../../app/tools/ServerAjax";

const BODY = 1;
const FORM = 2;
const QUERY = 3;
const PATH = 4;

export default class DataHandle{

    public static formatData(url: string, data: any[]){
        let option: any = {}, baseUrl: string = url, uri: string = "";
        option.url = "";
        option.data = {};
        for(let i=0;i<data.length;i++){
            let type = data[i]["type"], name = data[i]["name"], value = data[i]["value"];
            if(type == PATH){
                baseUrl.replace("{"+name+"}", value)
            }else if(type == QUERY){
                if(uri.length > 0){
                    uri += "&";
                }else{
                    uri += "?";
                }
                uri +=name+"="+value;
            }else if(type == FORM){
                option.data[name] = value;
            }else if(type == BODY){
                option.data = value;
            }
        }
        option.url = baseUrl + uri;
        return option
    }

    public static AjaxHandle(type: string, url: string, data: any[]){
        let headers: any = {
            "token": 123123
        };
        let option = this.formatData(url, data);
        return ServerAjax.setData(type, headers, option["url"], option["data"]).then((result)=>{
            //result = JSON.parse(result);
            if(result.status){
                throw new Error(result.message);
            }
            return result;
        });
    }

    public static formatResult(){

    }

    public static getAuth(token: string){
        return this.AjaxHandle("get", "http://127.0.0.1:8181/auth", [{name: "token", value: token, type: QUERY}]);
    }

    public static deleteAuth(token: string){
        return this.AjaxHandle("delete", "http://127.0.0.1:8181/auth", [{name: "token", value: token, type: QUERY}]);
    }

    public static putAuth(token: string, email: string){
        return this.AjaxHandle("put", "http://127.0.0.1:8181/auth", [{name: "token", value: token, type: QUERY},{name:"email", value: email, type: FORM}]);
    }

    public static postAuth(email: string){
        return this.AjaxHandle("post", "http://127.0.0.1:8181/auth", [{name: "email", value: email, type: QUERY}]);
    }
}