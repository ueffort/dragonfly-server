/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../libs/ts/react-router-redux.d.ts" />

import * as ActionTypes from "../constants/ActionTypes";
import * as Constant from "../../../Constant";
import {ajaxHandle, router} from "./Main";

var _dispatch: Redux.Dispatch = null;

export function get(id: number) {
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        ajaxHandle("get", `/api/playbook/get/${id}`, {}, dispatch)
            .then((result: any)=>{
                dispatch({type: ActionTypes.UPDATE_PLAYBOOK, value: result});
            });
    };
}
export function list(num: number, start: number) {
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        ajaxHandle("get", "/api/playbook/list", {num: num, start: start, count: true}, dispatch)
            .then((result: any)=>{
                dispatch({type: ActionTypes.UPDATE_PLAYBOOK_LIST, value: result});
            });
    };
}
export function add(type: string, param: any) {
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        ajaxHandle("post", "/api/playbook/add", {type: type, param: param}, dispatch)
            .then((result: any)=>{
                dispatch({type: ActionTypes.ADD_PLAYBOOK, value: result});
                dispatch(router(`/checkPlaybook/${result.id}`));
            });
    };
}
export function update(id: number, param: any) {
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        ajaxHandle("post", "/api/playbook/update", {id: id, param: param}, dispatch)
            .then((result: any)=>{
                dispatch({type: ActionTypes.UPDATE_PLAYBOOK, value: result});
            });
    };
}
export function del(id: number) {
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        ajaxHandle("post", "/api/playbook/delete", {id: id}, dispatch)
            .then((result: any)=>{
                dispatch({type: ActionTypes.DELETE_PLAYBOOK, value: result});
            });
    };
}
export function restart(id: number) {
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        ajaxHandle("post", "/api/playbook/restart", {id: id}, dispatch)
            .then((result: any)=>{
                dispatch({type: ActionTypes.UPDATE_PLAYBOOK, value: result});
            });
    };
}
export function stop(id: number) {
    return function(dispatch: Redux.Dispatch, getState?: () => {}){
        ajaxHandle("post", "/api/playbook/stop", {id: id}, dispatch)
            .then((result: any)=>{
                dispatch({type: ActionTypes.UPDATE_PLAYBOOK, value: result});
            });
    };
}