/**
 * Created by tutu on 16-1-18.
 */

/// <reference path="../../libs/ts/swagger-tools.d.ts" />
/// <reference path="../../libs/ts/js-yaml.d.ts" />
import * as express from "express";
import * as swaggerTools from "swagger-tools";
import * as yaml from "js-yaml";
import fs = require("fs");
import path = require("path");

let router: express.Router = express.Router();
var spec = fs.readFileSync("./data/api/swagger/swagger.yaml", "utf8");
var swaggerDoc = yaml.safeLoad(spec);
// swaggerRouter configuration
var options = {
    swaggerUi: '/swagger.json',
    controllers: './data/controller',
    useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};
var uiOptions = {
    apiDocs: '/api-docs',
    swaggerUi: '/docs',
    swaggerUiDir: path.join(__dirname, '..', 'swagger-ui')
};
// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware: any) {
    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    router.use(middleware.swaggerMetadata());

    // Validate Swagger requests
    router.use(middleware.swaggerValidator());

    // Route validated requests to appropriate controller
    //router.use(middleware.swaggerRouter(options));

    // Serve the Swagger documents and Swagger UI
    router.use(middleware.swaggerUi(uiOptions));
});

export default router;