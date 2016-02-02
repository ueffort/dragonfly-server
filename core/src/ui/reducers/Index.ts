/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../typings/redux/redux.d.ts" />

import { combineReducers } from "redux";
import PlayBook from "./PlayBook";
import Loading from "./Loading";
import Login from "./Login";

const AppReducers = combineReducers({
  PlayBook,
  Loading,
  Login
});

export default AppReducers;
