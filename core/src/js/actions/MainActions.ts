/**
 * Created by tutu on 16-1-4.
 */

import * as ActionTypes from "../constants/ActionTypes";
import { push } from 'react-router-redux';

export function login(userName: string, password: string) {
    return { type: ActionTypes.LOGIN, value: {userName: userName, password: password} };
}

export function register(userName: string, password: string) {
    return { type: ActionTypes.LOGIN, value: {userName: userName, password: password} };
}

export function router(path: string) {
    return push(path);
}
