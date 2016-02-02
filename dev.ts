#!/usr/bin/env node
/**
 * Created by tutu on 15-12-18.
 */
import CoreApp from "./core/App";
import DataApp from "./data/App";

let data: DataApp = new DataApp;
data.start();
let core: CoreApp = new CoreApp;
core.start();