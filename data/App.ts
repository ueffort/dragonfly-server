/**
 * Created by tutu on 15-12-17.
 */

import App from "../app/App";
import dataRouter from "./router/data";
import swaggerRouter from "./router/swagger";
import agent from "./handle/agent";

class DataApp extends App {

    protected name = "data";

    constructor() {
        super();
    }

    protected init(): void {
        //this.express.use(swaggerRouter);
        this.express.use(dataRouter(this));
        this.listen(this.config.DATA_CONFIG.PORT);
        this.agentHandle();
    }

    private agentHandle(): void {
        agent.getInstance(this).wait();
        this.logger.info("agent handle start");
    }
}

export default DataApp
