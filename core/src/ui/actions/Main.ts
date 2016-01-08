/**
 * Created by tutu on 16-1-4.
 */

import * as ActionTypes from "../constants/ActionTypes";

export function add(text: any) {
  return { type: ActionTypes.ADD, text };
}
