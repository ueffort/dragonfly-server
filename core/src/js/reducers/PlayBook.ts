/**
 * Created by tutu on 16-1-4.
 */

import * as ActionTypes from "../constants/ActionTypes";
import {getTypeList, getTypeMap} from "../../../playbook/Config";
import objectAssign = require("object-assign");

export interface playbookData{
    map: any,
    typeMap: any,
    typeList: string[],
    topIdList: number[],
    count: number
}

const initialValue: playbookData = {
    map: {},
    typeMap: getTypeMap(),
    typeList: getTypeList(),
    topIdList: [],
    count: 0

};

function PlayBook(state = initialValue, action: any) {
    switch (action.type) {
        case ActionTypes.ADD_PLAYBOOK:
            state.topIdList.unshift(action.value.id);
            state.map[action.value.id] = action.value;
            return objectAssign({}, state);
        case ActionTypes.UPDATE_PLAYBOOK:
            state.map[action.value.id] = action.value;
            return objectAssign({}, state);
        case ActionTypes.UPDATE_PLAYBOOK_LIST:
            state.count = action.value.count;
            state.topIdList = [];
            for(let i in action.value.list){
                state.map[action.value.list[i].id] = action.value.list[i];
                state.topIdList.push(action.value.list[i].id);
            }
            return objectAssign({}, state);
        case ActionTypes.DELETE_PLAYBOOK:
            delete state.map[action.value.id];
            return objectAssign({}, state);
        default:
            return state;
    }
}

export default PlayBook
