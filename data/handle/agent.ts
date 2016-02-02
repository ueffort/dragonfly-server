/**
 * Created by tutu on 15-12-21.
 */
import DataApp from "../App";
import {Redis} from "../../app/tools/Redis";
import {Promise} from "../../app/tools/Promise";
import ProtoBuf = require("protobufjs");
import fs = require("fs");
import {RedisClient} from "redis";

interface AgentConfig{
    prefix: string;
    master: string;
}


class Agent {

    private static instance: Agent;
    private redis: Redis;
    private redisInstance: RedisClient;
    private config: AgentConfig;
    private logger: any;
    private agentList: string[] = [];
    private handler: any = {};
    private taskModel: any;
    private resultModel: any;

    constructor(app: DataApp) {
        this.setApp(app);
        this.initProtoBuf();
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
     * @returns {Promise}
     */
    public send(advertise:string, command:string): Promise<any> {
        this.logger.debug("advertise"+advertise+" is not exist");
        if(this.agentList.indexOf(advertise) === -1){
            this.logger.debug("advertise"+advertise+" is not exist");
            return Promise.reject(new Error("no_exists"));
        }else{
            let publish = this.redis.instance();
            let id = "rand";
            let channel = "send/"+id;
            let self = this;
            let task = new this.taskModel({
                id: id,
                channel: channel,
                command: command
            });
            return new Promise((resolve, reject) => {
                self.subscribe(channel, function(err:Error, message:Buffer){
                    self.unsubscribe(channel);
                    if(err){
                        reject(err);
                    }else{
                        let result = self.resultModel.decode(message);
                        self.logger.debug(result);
                        resolve(result);
                    }
                });
                self.logger.debug(task);
                publish.publish(this.config.prefix+"/"+advertise, task.encode().toBuffer());
            });
        }
    }

    /**
     * 统一订阅
     * @param channel
     * @param handler
     */
    private subscribe(channel:string, handler:(err:Error, message:any)=>void){
        let logger = this.logger;
        channel = this.config.prefix+"/"+this.config.master+"/"+channel;
        this.redisInstance.subscribe(channel, function(err: Error){
            if(err){
                logger.warn(err);
                handler(err, null);
            }
        });
        this.handler[channel] = handler;
        logger.debug("agent subscribe:", channel);
    }

    /**
     * 统一取消订阅
     * @param channel
     */
    private unsubscribe(channel:string){
        let logger = this.logger;
        channel = this.config.prefix+"/"+this.config.master+"/"+channel;
        this.redisInstance.unsubscribe(channel);
        delete this.handler[channel];
        logger.debug("agent unsubscribe:", channel);
    }

    /**
     * 启动监听agent事件:register,unregister
     * @returns {Agent}
     */
    public wait(): Agent {
        let self = this;
        let logger = this.logger;
        let register = "register";
        let unregister = "unregister";

        // 传输协议是 protobuf, 所以需要redis返回buffers
        this.redisInstance = this.redis.newInstance({return_buffers: true});
        // agent注册监听
        this.subscribe(register, function(err:Error, message:Buffer){
            let result = message.toString();
            logger.info("register receive:", result);
            let index = self.agentList.indexOf(result);
            if(index === -1){
                self.agentList.push(result);
            }
            // 测试
            //self.send(message,"ls").then(function(result){
            //    self.logger.info(result.out);
            //});
        });
        // agent注销监听
        this.subscribe(unregister, function(err:Error, message:Buffer){
            let result = message.toString();
            logger.info("unregister receive:", result);
            let index = self.agentList.indexOf(result);
            if(index !== -1){
                self.agentList.splice(index, 1);
            }
        });
        this.redisInstance.on("message", function(channel:string, message:Buffer){
            if(self.handler[channel]){
                self.handler[channel](null, message);
            }else{
                logger.warn("channel is no handler:", channel);
            }
        });
        this.redisInstance.on("error", function(err: Error, res: string){
            logger.error(err, res);
            //self.wait();
        });
        this.redisInstance.on("exit", function(err: Error, res: string){
            self.logger.info("agent exit!");
            self.wait();
        });
        this.logger.info("agent waiting");
        return this;
    }
}

export default Agent
