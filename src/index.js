/**
 * Created by tutu on 15-12-17.
 */
var expressModule = require("express");
var config = require("app/config");
class app {
    constructor() {
        this.express = expressModule();
    }
    init() {
        this.express.listen(80, function () {
        });
        console.log(config);
    }
}
module.exports = app;
