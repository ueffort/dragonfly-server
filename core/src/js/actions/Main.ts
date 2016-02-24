/**
 * Created by tutu on 16-1-4.
 */

import * as ActionTypes from "../constants/ActionTypes";

export function login(isLogin: boolean) {
  return { type: ActionTypes.LOGIN, value: isLogin };
}
