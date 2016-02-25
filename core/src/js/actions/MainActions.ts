/**
 * Created by tutu on 16-1-4.
 */

import * as ActionTypes from "../constants/ActionTypes";
import { push } from 'react-router-redux';

export function login(isLogin: boolean) {
    return { type: ActionTypes.LOGIN, value: isLogin };
}

export function router(path: string) {
    return push(path);
}
