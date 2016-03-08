/**
 * Created by tutu on 16-1-4.
 */

import * as ActionTypes from "../constants/ActionTypes";
import { push } from 'react-router-redux';
import Ajax from "../tools/Ajax";


export function login(email: string, password: string) {
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        dispatch(load());
        Ajax.post("/api/login", {email: email, password: password})
            .then((result: any)=>{
                if(result.status == 200){
                    dispatch({type: ActionTypes.LOGIN, value: {email: result.data.email}});
                    dispatch(router("/"));
                }else{
                    dispatch(message(result.message));
                }
                dispatch(loaded());
            }).catch(function(){
                dispatch(loaded());
            });
    };
}

export function register(email: string, password: string) {
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        dispatch(load());
        Ajax.post("/api/register", {email: email, password: password})
            .then((result: any)=>{
                if(result.status == 200){
                    dispatch({type: ActionTypes.REGISTER, value: {email: result.data.email}});
                    dispatch(router("/"));
                }else{
                    dispatch(message(result.message));
                }
                dispatch(loaded());
            }).catch(function(){
                dispatch(loaded());
            });
    };
}

export function message(message: string){
    return {type: ActionTypes.MESSAGE, value: message};
}

export function load() {
    return { type: ActionTypes.LOAD, value: true };
}

export function loaded() {
    return { type: ActionTypes.LOADED, value: true };
}

export function leftShow() {
    return { type: ActionTypes.LEFT_SHOW, value: true };
}

export function router(path: string) {
    return push(path);
}
