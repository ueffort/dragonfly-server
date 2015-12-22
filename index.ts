/**
 * Created by tutu on 15-12-18.
 */
/// <reference path="libs/ts/config.d.ts" />

import * as config from "app/config"
import {coreApp} from "./core/app"
import {dataApp} from "./data/app"

var core:coreApp = new coreApp;
core.init();
var data:dataApp = new dataApp;
data.init();
