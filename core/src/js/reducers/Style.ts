/**
 * Created by tutu on 16-1-4.
 */

import * as ActionTypes from "../constants/ActionTypes";

interface defaultValue {
    leftShow: boolean;
}

const initialValue:defaultValue = {
    leftShow: false
};

function Style(state:defaultValue = initialValue, action: any) {
    switch (action.type) {
        case ActionTypes.LEFT_SHOW:
            return {leftShow: !state.leftShow};
        default:
            return state;
    }
}

export default Style
