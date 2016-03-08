/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../typings/redux/redux.d.ts" />

import { combineReducers } from "redux";
import PlayBook from "./PlayBook";
import Loading from "./Loading";
import User from "./User";
import Message from "./Message";
import Style from "./Style";
import { routerReducer } from 'react-router-redux';

const AppReducers = combineReducers({
  PlayBook,
  Loading,
  User,
  Style,
  routing: routerReducer
});

export default AppReducers;
