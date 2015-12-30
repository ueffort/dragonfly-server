/**
 * Created by tutu on 15-12-18.
 */


/// <reference path="../../typings/express/express.d.ts" />

import * as express from "express";

let core: express.Router = express.Router();

core.get("/core/", function(req: express.Request, res: express.Response, next: any) {
    return;
});

export default core;
