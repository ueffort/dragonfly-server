/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../libs/ts/react-router-redux.d.ts" />

import * as ActionTypes from "../constants/ActionTypes";
import { push } from 'react-router-redux';
import Ajax from "../../../../app/tools/Ajax";
import * as Constant from "../../../Constant";

export function ajaxHandle(url:string, data: any, dispatch: Redux.Dispatch):Promise<any>{
    dispatch(load());
    return Ajax.post(url, data)
        .then((result: any)=>{
            dispatch(loaded());
            if(!result) return Promise.reject(false);
            let status = result.status;
            if(status == Constant.SUCCESS_STATUS){
                return result.data;
            }else if(status == Constant.NEED_LOGIN_STATUS){
                dispatch({type: ActionTypes.LOGINOUT});
                dispatch(router("/login"));
            }else{
                dispatch(message(result.message));
            }
            return Promise.reject(false);
        }).catch(function(){
            dispatch(loaded());
        });
}

export function message(message: string){
    return { type: ActionTypes.MESSAGE, value: message };
}

export function load() {
    return { type: ActionTypes.LOAD };
}

export function loaded() {
    return { type: ActionTypes.LOADED };
}

export function leftShow() {
    return { type: ActionTypes.LEFT_SHOW };
}

export function router(path: string) {
    return push(path);
}
