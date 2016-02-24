/**
 * Created by tutu on 16-2-24.
 */

/// <reference path="../../typings/node/node.d.ts" />

import * as crypto from "crypto";

export function md5(str: string) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}