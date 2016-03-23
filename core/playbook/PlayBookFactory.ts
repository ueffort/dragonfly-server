import {BasePlaybook} from "./BasePlaybook";
import App from "../../app/App";
/**
 * Created by tutu on 16-3-23.
 */

export default class PlayBookFactory{
    private static playbookTypeList:any = {};

    public static getPlaybook(app:App, typeName:string):BasePlaybook{
        if(!PlayBookFactory.playbookTypeList[typeName]){
            let playbook = require(`./${typeName}Playbook`).default;
            PlayBookFactory.playbookTypeList[typeName] = new playbook(app);
        }
        return PlayBookFactory.playbookTypeList[typeName];
    }
}