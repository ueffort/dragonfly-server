/**
 * Created by tutu on 16-1-4.
 */

import * as ActionTypes from "../constants/ActionTypes";

interface defaultValue {
    isLoad:boolean;
    loading:any[];
}

const initialValue:defaultValue = {
    isLoad:false,
    loading:[]
};

function Loading(state:defaultValue = initialValue, action: any) {
    switch (action.type) {
        case ActionTypes.LOAD:
            state.isLoad = true;
            state.loading.push(true);
            return state;
        case ActionTypes.LOADED:
            state.loading.pop();
            if(state.loading.length>0){
                state.isLoad = true;
            }else{
                state.isLoad = false;
            }
            return state;
        default:
            return state;
    }
}

export default Loading
