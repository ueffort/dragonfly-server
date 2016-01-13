/**
 * Created by tutu on 15-12-18.
 */

/// <reference path="../../typings/express/express.d.ts" />

import * as express from "express";

let data: express.Router = express.Router();

data.get("/", function(req: express.Request, res: express.Response, next: any) {
    res.send("is ok!!");
});

export default data;
