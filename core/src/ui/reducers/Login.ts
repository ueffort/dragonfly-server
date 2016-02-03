/**
 * Created by tutu on 16-1-4.
 */

import * as ActionTypes from "../constants/ActionTypes";

const initialValue = {isLogin: false};

function Login(state = initialValue, action: any) {
    switch (action.type) {
        case ActionTypes.LOGIN:
            state.isLogin = action.value;
            return state;
        default:
            return state;
    }
}

export default Login
