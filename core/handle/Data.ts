/**
 * Created by tutu on 16-3-9.
 */

/// <reference path="../../libs/ts/request.d.ts" />

import * as request from 'request';
import ServerHttp from "../../app/tools/ServerHttp";
import jsonFile from "../../app/tools/JsonFile";

const BODY = 1;
const FORM = 2;
const QUERY = 3;
const PATH = 4;

const config = jsonFile.read("app/config");

export default class Data{

    public static formatData(url: string, data: any[]){
        let option: any = {}, baseUrl: string = url, uri: string = "";
        option.url = config.DATA_CONFIG.HOST + config.DATA_CONFIG.PORT;
        option.data = {};
        option.hasToken = false;
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
            if(data[i]["name"] == "token") option.hasToken = true;
        }
        option.url += baseUrl + uri;
        return option
    }

    public static Http(type: string, url: string, data: any[]){
        let headers: any = {};
        let option = this.formatData(url, data);
        if(!option.hasToken) headers["token"] = 123123;
        return ServerHttp.setData(type, headers, option["url"], option["data"]).then((result)=>{
            //result = JSON.parse(result);
            if(result.status){
                throw new Error(result.message);
            }
            return this.formatResult(result);
        });
    }

    public static formatResult(result: any){
        return result;
    }

    public static getAuth(token: string){
        return this.Http("get", "/auth", [{name: "token", value: token, type: QUERY}]);
    }

    public static deleteAuth(token: string){
        return this.Http("delete", "/auth", [{name: "token", value: token, type: QUERY}]);
    }

    public static putAuth(token: string, email: string){
        return this.Http("put", "/auth", [{name: "token", value: token, type: QUERY},{name:"email", value: email, type: FORM}]);
    }

    public static postAuth(email: string){
        return this.Http("post", "/auth", [{name: "email", value: email, type: QUERY}]);
    }
}