/**
 * Created by tutu on 15-12-22.
 */

export default class Platform {

    private static platform: Platform;
    private pc: boolean;
    private android: boolean;
    private ios: boolean;
    private server: boolean;

    constructor() {
        if(typeof window == "object"){
            this.pc = false;
            this.android = false;
            this.ios = false;
            this.server = true;
        }
    }

    public static getPlatform() {
        if(!this.platform){
            this.platform = new Platform();
        }
        return this.platform;
    }

    public isPC() {
        return this.pc;
    }
}

