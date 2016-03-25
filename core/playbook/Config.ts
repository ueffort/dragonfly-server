/**
 * Created by tutu on 16-3-24.
 */

export interface setting{
    global: boolean;
    title: string;
    name: string;
}

export function getTypeMap(){
    return {
        demo: {
            global: false,
            title: "Demo",
            name: "demo"
        }
    }
}

export function getTypeList(){
    return ["demo"]
}