/**
 * Created by tutu on 15-12-21.
 */

/// <reference path="../../typings/protobufjs/protobufjs.d.ts" />

import DataApp from "../App";
import {Redis} from "../../app/tools/Redis";
import {Promise} from "../../app/tools/Promise";
import * as ProtoBuf from "protobufjs";
import * as fs from "fs";
import {RedisClient} from "redis";

interface AgentConfig{
    prefix: string;
    master: string;
    advertise: string;
}

interface AgentInfo{
    advertiser: string;
    time: Date;
    number: number;
}


class Agent {

    private static instance: Agent;
    private redis: Redis;
    private redisInstance: RedisClient;
    private config: AgentConfig;
    private logger: any;
    private agentList: string[] = [];
    private agentInfo: {[key: string]: AgentInfo} = {};
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
        if(this.agentList.indexOf(advertise) === -1){
            this.logger.debug("advertise:"+advertise+" is not exist");
            return Promise.reject(new Error("no_exists"));
        }else{
            let publish = this.redis.instance();
            let id = this.uuid();
            let channel = this.config.advertise+'/'+id;
            let self = this;
            let task = new this.taskModel({
                id: id,
                channel: channel,
                command: command
            });
            return new Promise((resolve, reject) => {
                self.subscribe(channel, function(err:Error, message:Buffer){
                    self.unsubscribe(channel);
                    self.agentInfo[advertise].number += 1;
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
                self.agentInfo[result] = {
                    advertiser: result,
                    time: new Date(),
                    number: 0
                };
            }else{
                self.agentInfo[result].time = new Date();
            }

            logger.debug("agent List:", self.agentList);
            // 测试
            //self.send(result,"ls").then(function(result){
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
                delete self.agentInfo[result];
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

    private uuid():string{
        let randMath = function(){
            var b = new Array(16);
            for (var i = 0, r = 0; i < 16; i++) {
                if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
                b[i] = r >>> ((i & 0x03) << 3) & 0xff;
            }
            return b;
        },
            uuidParse = function(buf:any, offset?:number){
                let _byteToHex:any[] = [];
                let _hexToByte:{[key: string]: any} = {};
                for (var i = 0; i < 256; i++) {
                    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
                    _hexToByte[_byteToHex[i]] = i;
                }
                var i:number = offset || 0, bth = _byteToHex;
                return  bth[buf[i++]] + bth[buf[i++]] +
                    bth[buf[i++]] + bth[buf[i++]] +
                    bth[buf[i++]] + bth[buf[i++]] +
                    bth[buf[i++]] + bth[buf[i++]] +
                    bth[buf[i++]] + bth[buf[i++]];
            },
            uuid = function(){
                var rnds = randMath();
                rnds[6] = (rnds[6] & 0x0f) | 0x40;
                rnds[8] = (rnds[8] & 0x3f) | 0x80;
                return uuidParse(rnds);
            };
        return uuid();
    }
}

export default Agent
