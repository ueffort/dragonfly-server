/**
 * Created by tutu on 16-1-4.
 */

import * as ActionTypes from "../constants/ActionTypes";
import { push } from 'react-router-redux';
import Ajax from "../../../../app/tools/Ajax";
import * as ErrorID from "../../../ErrorID";

export function ajaxHandle(url:string, data: any, dispatch: Redux.Dispatch):Promise<any>{
    dispatch(load());
    return Ajax.post(url, data)
        .then((result: any)=>{
            dispatch(loaded());
            if(!result) return Promise.reject(false);
            let status = result.status;
            if(status == ErrorID.SUCCESS_STATUS){
                return result.data;
            }else if(status == ErrorID.NEED_LOGIN_STATUS){
                dispatch(loginOut());
                dispatch(router("/login"));
            }else{
                dispatch(message(result.message));
            }
            return Promise.reject(false);
        }).catch(function(){
            dispatch(loaded());
        });

}

export function login(email: string, password: string) {
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        ajaxHandle("/api/login", {email: email, password: password}, dispatch)
            .then((result: any)=>{
                    dispatch({type: ActionTypes.LOGIN, value: {email: result.email}});
                    dispatch(router("/"));
            });
    };
}

export function register(email: string, password: string) {
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        ajaxHandle("/api/register", {email: email, password: password}, dispatch)
            .then((result: any)=>{
                dispatch({type: ActionTypes.REGISTER, value: {email: result.email}});
                dispatch(router("/"));
            });
    };
}

export function loginOut(){
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        ajaxHandle("/api/loginOut", {}, dispatch)
            .then(()=>{
                dispatch({ type: ActionTypes.LOGINOUT });
                dispatch(router("/login"));
            });
    };
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        dispatch({ type: ActionTypes.LOGINOUT });
        dispatch(router("/login"));
    };
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
