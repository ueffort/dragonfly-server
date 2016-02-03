/**
 * Created by tutu on 16-1-4.
 */

import * as ActionTypes from "../constants/ActionTypes";

interface defalutValue {
    isLoad:boolean;
    loading:any[];
}

const initialValue:defalutValue = {
    isLoad:false,
    loading:[]
};

function Loading(state:defalutValue = initialValue, action: any) {
    switch (action.type) {
        case ActionTypes.LOAD:
            state.isLoad = true;
            state.loading.push(true);
            return state;
        case ActionTypes.LOADED:
            state.loading.pop();
            if(state.loading.length>0) state.isLoad = true;
            return state;
        default:
            return state;
    }
}

export default Loading
