/**
 * Created by tutu on 15-12-17.
 */
import expressModule = require("express");
import config = require("app/config");

class app{

    express:expressModule.Application;

    constructor(){
        this.express = expressModule();
    }

    public init():void{
        this.express.listen(80, function() {

        });
        console.log(config)
    }

}

export = app
