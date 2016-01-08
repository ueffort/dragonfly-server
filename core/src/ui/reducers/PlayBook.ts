/**
 * Created by tutu on 16-1-4.
 */

import * as ActionTypes from "../constants/ActionTypes";

const initialValue = [
    {"name": "test"}
];

function PlayBook(state = initialValue, action: any) {
    switch (action.type) {
        case ActionTypes.ADD:
            return state;
        default:
            return state;
    }
}

export default PlayBook
