/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../typings/redux/redux.d.ts" />

import { combineReducers } from "redux";
import PlayBook from "./PlayBook";

const AppReducers = combineReducers({
  PlayBook,
});

export default AppReducers;
