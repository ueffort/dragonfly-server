/**
 * Created by tutu on 16-1-4.
 */

import * as ActionTypes from "../constants/ActionTypes";

const initialValue = {name: ""};

function User(state = initialValue, action: any) {
    switch (action.type) {
        case ActionTypes.LOGIN:
            state.name = action.value;
            return state;
        default:
            return state;
    }
}

export default User
