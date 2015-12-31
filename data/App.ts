/**
 * Created by tutu on 15-12-17.
 */

import App from "../app/App";
import dataRouter from "./router/data";
import agentHandle from "./handle/agentHandle";
import jsonFile from "../app/tools/JsonFile";

class DataApp extends App {

    private agentHandle: agentHandle;

    constructor() {
        super();
        this.agentHandle = agentHandle.getInstance();
    }

    public init(): void {
        this.express.use(dataRouter);
        super.errorHandle();
        let config = jsonFile.read("app/config");
        this.express.listen(config.DATA_CONFIG.PORT, function(){
            console.log(config);
            console.log("data api listen port:", config.DATA_CONFIG.PORT);
        });
        this.listenAgent();
    }

    private listenAgent(): void {
        this.agentHandle.wait();
        console.log("agent listen start");
    }
}

export default DataApp
