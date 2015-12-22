/**
 * Created by tutu on 15-12-21.
 */

export class agentHandle {

    static handle:agentHandle;

    constructor() {

    }

    static getInstance():agentHandle{
        if(!this.handle){
            this.handle = new agentHandle
        }
        return this.handle
    }

    public send():void{

    }

    public wait():void{

    }
}