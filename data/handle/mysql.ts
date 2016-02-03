/**
 * Created by tutu on 16-1-21.
 */
import {Mysql} from "../../app/tools/Mysql";

/**
 * 查询token对应的auth数据
 * @param mysql
 * @param token
 * @returns {Promise<any>}
 */
export function token(mysql:Mysql, token:string){
    return mysql.promise("SELECT * FROM `data_auth` WHERE `token`='"+token+"' limit 1").then(function(result:any[]){
        return result[0];
    })
}