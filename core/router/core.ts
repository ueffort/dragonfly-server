/**
 * Created by tutu on 15-12-18.
 */


/// <reference path="../../typings/express/express.d.ts" />

import * as express from "express";
import CoreApp from "../App";
import Dispatch from "../../app/abstract/Dispatch";
import Api from "../controllers/api";
import * as Constant from "../Constant";
import Playbook from "../controllers/playbook";


export default function routerHandle(app:CoreApp):express.Router{
    let router: express.Router = express.Router();

    // 全局登录验证
    router.use("/api/*", Dispatch.session(app,['/api/login', '/api/register'], function(session: any){
        let user = session["user"];
        if(user["email"]){
            return Promise.resolve(true);
        }else{
            throw new Error("need login").name =  Constant.NEED_LOGIN;
        }
    }));

    let api = new Api(app);
    let playbook = new Playbook(app);

    //登录,注册,登出
    router.post("/api/login", api.handle([{name:"email", form:true}, {name:"password", form:true}], api.login));
    router.post("/api/register", api.handle([{name:"email", form:true}, {name:"password", form:true}], api.register));
    router.post("/api/loginOut", api.handle([], api.loginOut));

    //playbook 查看 配置,状态,列表
    router.get("/api/playbook/setting/:type", playbook.handle([{name:"type", param:true}], playbook.playbookSetting));
    router.get("/api/playbook/status/:id", playbook.handle([{name:"id", param:true}], playbook.playbookStatus));
    router.get("/api/playbook/list", playbook.handle([{name:"num", query:true}, {name:"start", query:true}, {name:"count", query:true}], playbook.playbookList));

    //playbook 操作 添加,删除,重启
    router.post("/api/playbook/add", playbook.handle([{name:"type", form:true}, {name:"param", form:true}], playbook.playbookAdd));
    router.post("/api/playbook/update", playbook.handle([{name:"id", form:true}, {name:"param", form:true}], playbook.playbookUpdate));
    router.post("/api/playbook/delete", playbook.handle([{name:"id", form:true}], playbook.playbookDelete));
    router.post("/api/playbook/restart", playbook.handle([{name:"id", form:true}], playbook.playbookRestart));
    router.post("/api/playbook/stop", playbook.handle([{name:"id", form:true}], playbook.playbookStop));

    return router;
};
