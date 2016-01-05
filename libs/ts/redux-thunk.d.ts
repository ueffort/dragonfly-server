// Type definitions for redux-thunk
// Project: https://github.com/gaearon/redux-thunk
// Definitions by: Qubo <https://github.com/tkqubo>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


declare module "redux-thunk" {
    import { Middleware, Dispatch } from "redux";

    interface Thunk extends Middleware { }

    interface ThunkInterface {
        <T>(dispatch: Dispatch, getState?: () => T): any;
    }
    var thunk: Thunk;
    export = thunk;
}
