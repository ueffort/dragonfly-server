/**
 * Created by tutu on 15-12-17.
 */

import * as express from "express";
import App from "../app/App";
import dataRouter from "./router/data";
import swaggerRouter from "./router/swagger";
import Agent from "./handle/agent";

class DataApp extends App {

    protected name = "data";
    protected _agent:Agent;

    constructor() {
        super();
    }

    protected init(): void {
        this.express.use(swaggerRouter);
        this.express.use(dataRouter(this));
        this.listen(this.config.DATA_CONFIG.PORT);
        this.agentHandle();
    }

    /**
     * 获取agent实例
     * @returns {Agent}
     */
    public agent(): Agent {
        return this._agent;
    }

    private agentHandle(): void {
        this._agent = Agent.getInstance(this).wait();
    }

    /**
     * 错误处理handle
     */
    protected errorHandle(): void {
        var self = this;
        this.express.use(function(req: express.Request, res: express.Response, next: any){
            res.status(404).json({status:400, message:"not find!"});
        });
        this.express.use(function(err: Error, req: express.Request, res: express.Response, next: any){
            self.logger.error(err);
            res.status(500).json({status:500, message:err.message});
        });
    }
}

export default DataApp
