/**
 * Created by tutu on 16-1-4.
 */

import * as ActionTypes from "../constants/ActionTypes";

export function add(text) {
  return { type: ActionTypes.ADD, text };
}
