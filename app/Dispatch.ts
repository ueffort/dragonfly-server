/**
 * Created by apple on 16/1/13.
 */
import session = require("express-session");
import * as express from "express";
import App from "../app/App";
import {RequestHandler} from "express";
class Dispatch{

    /**
     * 访问验证middle
     * @param app
     * @param tokenKey
     * @param verify
     * @returns {function(express.Request, express.Response, any): *}
     */
    public static token(app: App, tokenKey: string, verify: (token:string, notice:(result: boolean)=>void) => void):RequestHandler{
        return function(req: express.Request, res: express.Response, next: any){
            if(!req.header(tokenKey)){
                return next(new Error("auth error"));
            }else{
                let token = req.header(tokenKey);
                verify(token, function(result:boolean){
                   if(result){
                       next();
                   }else{
                       next(new Error("auth fail"));
                   }
                });
            }
        }
    }

    /**
     * session验证middle
     * @param app
     * @param filterUrl
     * @param verify
     * @returns {function(express.Request, express.Response, any): undefined}
     */
    public static session(app: App, filterUrl: string[], verify: (session: {[key: string]: any}, notice:(result: boolean)=>void) => void):RequestHandler{
        return function(req: express.Request, res: express.Response, next: any){
            if(filterUrl.indexOf(req.baseUrl) !== -1){
                next();
            }else{
                verify(req.session, function(result:boolean){
                    if(result){
                        next();
                    }else{
                        next(new Error("need login"));
                    }
                });
            }
        }
    }
}

export default Dispatch