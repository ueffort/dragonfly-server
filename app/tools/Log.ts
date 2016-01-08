/**
 * Created by tutu on 16-1-8.
 */
import * as express from "express";
import * as bunyan from "bunyan";

export function create(name: string, debug: boolean) {
    let level = debug ? bunyan.TRACE : bunyan.INFO;


    // if (!logger) {
    //  opts.name = (opts.name || app.settings.shortname || app.settings.name || app.settings.title || 'express');
    //  opts.serializers = opts.serializers || {};
    //  opts.serializers.req = opts.serializers.req || bunyan.stdSerializers.req;
    //  opts.serializers.res = opts.serializers.res || bunyan.stdSerializers.res;
    //  err && (opts.serializers.err = opts.serializers.err || bunyan.stdSerializers.err);
    //  logger = bunyan.createLogger(opts);
    // }
    return bunyan.createLogger({
        name: name,
        streams: [{
            level: level,
            stream: process.stdout
        }],

    });
}
export class Logger extends bunyan.Logger {}
export function middle(logger: bunyan.Logger) {
    let format_string = ":remote-address :incoming :method :url HTTP/:http-version :status-code :res-headers[content-length] "+
        ":referer :user-agent[family] :user-agent[major].:user-agent[minor] :user-agent[os] :response-time ms";
    let format = compile(format_string);
    return function (req: express.Request, res: express.Response, next: any) {
        let startTime = process.hrtime();

        let app = req.app;

        function logging(incoming: boolean) {
            if (!incoming) {
                res.removeListener("finish", logging);
                res.removeListener("close", logging);
            }

            let status = res.statusCode,
                method = req.method,
                url = (req.baseUrl || "") + (req.url || "-"),
                referrer = req.header("referer") || req.header("referrer") || "-",
                ua = req.header("user-agent"),
                // httpVersion = req.httpVersionMajor + "." + req.httpVersionMinor,
                hrtime = process.hrtime(startTime),
                responseTime = hrtime[0] * 1e3 + hrtime[1] / 1e6,
                ip, logFn;

            ip = ip || req.ip || req.connection.remoteAddress ||
                (req.socket && req.socket.remoteAddress) ||
                "127.0.0.1";

            let meta = {
                body: req.body,
                headers: req.headers,
                hrtime: hrtime,
                incoming: incoming ? "-->" : "<--",
                ip: ip,
                method: method,
                referrer: referrer,
                req: req,
                res: res,
                status: status,
                time: responseTime,
                url: url,
                userAgent: ua
            };

            var level = levelFn(status, meta);
            logFn = logger[level] ? logger[level] : logger.info;

            var json = meta;

            if (!json) {
                logFn.call(logger, format(meta));
            } else {
                logFn.call(logger, json, format(meta));
            }
        }


        if (immediate) {
            logging(true);
        } else {
            res.on("finish", logging);
            res.on("close", logging);
        }

        next(null);
    };
}

function compile(fmt: string) {
    fmt = fmt.replace(/"/g, "\\\"");
    let js = "  return \"" + fmt.replace(/:([-\w]{2,})(?:\[([^\]]+)\])?/g, function (_, name, arg) {
        if (arg) {
          return "\"\n + (meta[\"" + name + "\"] ? (meta[\"" + name + "\"][\"" + arg + "\"]||"+
              "(typeof meta[\"" + name + "\"][\"" + arg + "\"] === \"number\"?\"0\": \"-\")) : \"-\") + \"";
        } else {
          return "\"\n    + ((meta[\"" + name + "\"]) || (typeof meta[\"" + name + "\"] === \"number\"?\"0\": \"-\")) + \"";
        }
    }) + "\";";
    return new Function("meta", js);
}


function levelFn(status: number) {
    if (status >= 500) { // server internal error or error
        return "error";
    } else if (status >= 400) { // client error
        return "warn";
    }
    return "info";
}
