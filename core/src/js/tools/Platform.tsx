/**
 * Created by tutu on 15-12-22.
 */

class Platform{

    private static platform: Platform;
    private pc: boolean;
    private android: boolean;

    constructor() {
        this.pc = false;
    }

    public static getPlatform(){
        if(!this.platform){
            this.platform = new Platform();
        }
        return this.platform;
    }

    public isPC(){
        return this.pc;
    }
}

