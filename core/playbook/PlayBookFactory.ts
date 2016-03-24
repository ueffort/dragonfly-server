import {BasePlaybook} from "./BasePlaybook";
import App from "../../app/App";
/**
 * Created by tutu on 16-3-23.
 */

export default class PlayBookFactory{
    private static playbookTypeList:any = {};

    public static getPlaybook(typeName:string):any{
        if(!PlayBookFactory.playbookTypeList[typeName]){
            let playbook:any = null;
            try {
                playbook = require(`./${typeName}Playbook`).default;
            }catch (error){
                playbook = null;
            }
            PlayBookFactory.playbookTypeList[typeName] = playbook;
        }
        return PlayBookFactory.playbookTypeList[typeName];
    }
}