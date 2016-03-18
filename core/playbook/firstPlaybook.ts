/**
 * Created by tutu on 16-3-17.
 */

import {Playbook as PlaybookRecord, PlaybookModel} from "../model/playbook";
import App from "../../app/App";
import {BasePlaybook} from "./BasePlaybook";

export class FirstPlaybook extends BasePlaybook{

    protected  _initResult():any[]{
        return [];
    }
}