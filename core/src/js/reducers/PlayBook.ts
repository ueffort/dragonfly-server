/**
 * Created by tutu on 16-1-4.
 */

import * as ActionTypes from "../constants/ActionTypes";

const initialValue = [
    {"name": "test", "status": "loading"},
    {"name": "test", "status": "loading"},
    {"name": "test", "status": "loading"},
    {"name": "test", "status": "loading"},
    {"name": "test", "status": "loading"},
    {"name": "test", "status": "loading"},
    {"name": "test", "status": "loading"},
    {"name": "test", "status": "loading"},
    {"name": "test", "status": "loading"},
    {"name": "test", "status": "loading"}
];

function PlayBook(state = initialValue, action: any) {
    return state;
}

export default PlayBook
