/**
 * Created by tutu on 15-12-22.
 */

/// <reference path="../../../../libs/ts/ajax-easy.d.ts" />

import ajax = require("ajax-easy");
import {Promise} from "../../../../app/tools/Promise";

export default class Ajax {

    public static post(url: string, data: any){
        return this.setData("post", url, data)
    }

    public static get(url: string, data: any){
        return this.setData("get", url, data)
    }

    private static setData(type: string, url: string, data: any){
        return new Promise((resolve, reject) => {
                ajax({
                    url: url,
                    type: type,
                    data: data,
                    success: function(result: any) {
                        resolve(result)
                    },
                    fail: function(result: any) {
                        reject(result)
                    }
                });
            });
    }
}

