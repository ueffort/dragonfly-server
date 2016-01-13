/**
 * Created by tutu on 15-12-17.
 */

import App from "../app/App";
import dataRouter from "./router/data";
import agentHandle from "./handle/agentHandle";
import swaggerTools = require("swagger-tools");
import yaml = require("js-ymal");
import fs = require("fs");

class DataApp extends App {

    private agentHandle: agentHandle;
    protected name = "data";

    constructor() {
        super();
        this.agentHandle = agentHandle.getInstance();
    }

    protected init(): void {
        this.express.use(dataRouter);
        this.swagger();
        this.listen(this.config.DATA_CONFIG.PORT);
    }

    private swagger(): void {
        var app = this.express;
        var spec = fs.readFileSync("./data/api/swagger/swagger.yaml", "utf8");
        var swaggerDoc = yaml.safeLoad(spec);
        // swaggerRouter configuration
        var options = {
            swaggerUi: '/swagger.json',
            controllers: './data/handle',
            useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
        };
        // Initialize the Swagger middleware
        swaggerTools.initializeMiddleware(swaggerDoc, function (middleware: any) {
            // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
            app.use(middleware.swaggerMetadata());

            // Validate Swagger requests
            app.use(middleware.swaggerValidator());

            // Route validated requests to appropriate controller
            app.use(middleware.swaggerRouter(options));

            // Serve the Swagger documents and Swagger UI
            app.use(middleware.swaggerUi());
        });
    }

    private listenAgent(): void {
        this.agentHandle.wait();
        this.logger.info("agent listen start");
    }
}

export default DataApp
