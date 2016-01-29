/**
 * Created by tutu on 15-12-21.
 */
import DataApp from "../App";
import {Redis} from "../../app/tools/Redis";
import ProtoBuf = require("protobufjs");
import fs = require("fs");

interface AgentConfig{
    prefix: string;
    master: string;
}

class Agent {

    private static instance: Agent;
    private redis: Redis;
    private config: AgentConfig;
    private logger: any;
    private agentList: string[];
    private taskModel: any;
    private resultModel: any;

    constructor(app: DataApp) {
        this.setApp(app);
        this.initProtoBuf();
        return;
    }

    /**
     * 单例模式调用agent
     * @param app
     * @returns {Agent}
     */
    public static getInstance(app: DataApp): Agent {
        if (!this.instance) {
            this.instance = new Agent(app);
        }
        return this.instance;
    }

    /**
     * 初始化app设置
     * @param app
     * @returns {Agent}
     */
    private setApp(app: DataApp): Agent{
        this.redis = app.redis();
        this.logger = app.logger;
        this.config = app.config.AGENT;
        return this;
    }

    /**
     * 初始化协议对象
     */
    private initProtoBuf(){
        let builder = ProtoBuf.loadProtoFile("app/dragonfly.proto");
        let main = builder.build("main");
        this.taskModel = main['Task'];
        this.resultModel = main['Result'];
    }

    /**
     * 发送命令到指定的advertise
     * @param advertise
     * @param command
     * @param callback
     * @returns {Agent}
     */
    public send(advertise:string, command:string, callback: (err:Error, status:number, out:string, out_err:string) => void): Agent {
        if(this.agentList.indexOf(advertise) === -1){
            this.logger.debug("advertise"+advertise+" is not exist");
            callback(new Error("no_exists"), null, null, null);
        }else{
            let instance = this.redis.instance();
            let channel = this.config.prefix+"/"+this.config.master+"/";
            let self = this;
            let id = "";
            let task = new this.taskModel({
                id: id,
                channel: channel,
                command: command
            });
            instance.subscribe(channel, function(err:Error, res:Buffer){
                if(err){
                    callback(err, null, null, null);
                }else{
                    let result = self.resultModel.decode(res);
                    self.logger.debug(result);
                    instance.unsubscribe(channel);
                }
            });
            self.logger.debug(task);
            instance.publish(this.config.prefix+"/"+advertise, task.encode().toBuffer());
        }
        return this;
    }

    /**
     * 启动监听agent事件:register,unregister
     * @returns {Agent}
     */
    public wait(): Agent {
        let self = this;
        let instance = this.redis.instance();
        let logger = this.logger;
        // agent注册监听
        instance.subscribe(this.config.prefix+"/"+this.config.master+"/register", function(err: Error, res: string){
            logger.info();
            let index = self.agentList.indexOf(res);
            if(index === -1){
                self.agentList.push(res);
            }
        });
        // agent注销监听
        instance.subscribe(this.config.prefix+"/"+this.config.master+"/unregister", function(err: Error, res: string){
            logger.info();
            let index = self.agentList.indexOf(res);
            if(index !== -1){
                self.agentList.splice(index, 1);
            }
        });
        instance.on("error", function(err: Error, res: string){
            logger.error(err, res);
            //self.wait();
        });
        return this;
    }
}

export default Agent
