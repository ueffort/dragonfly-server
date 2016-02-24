/**
 * Created by tutu on 15-12-25.
 */

/// <reference path="../../../../libs/ts/immutable.d.ts" />
/// <reference path="../../../../libs/ts/common.d.ts" />
/// <reference path="../../../../typings/react/react.d.ts" />
/// <reference path="../../../../typings/react-redux/react-redux.d.ts" />
/// <reference path="../../../../typings/react-router/react-router.d.ts" />
/// <reference path="../../../../typings/history/history.d.ts" />

import * as React from "react";
import { Provider } from "react-redux";
import MainStore from "../store/MainStore";
import App from "./App";
import Login from "./Login";
import DevTools from "./DevTools";
import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';

interface ContainerProp {
    data:any;
}


class Container extends React.Component<ContainerProp, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    private getDevTools(){
        if(window.__DEV__){
            return <DevTools/>
        }
    }

    private getStore(){
        return MainStore(this.props.data, [routerMiddleware(browserHistory)]);
    }

    private getHistory(store: any){
        return syncHistoryWithStore(browserHistory, store);
    }

    private getRoutes(store: any){
        return (
            <Router history={this.getHistory(store)}>
                <Route path="login">
                    <IndexRoute component={Login}/>
                </Route>
                <Route path="*">
                    <IndexRoute component={App}/>
                </Route>
            </Router>
        );
    }

    public render() {
        let store = this.getStore();
        return (
            <Provider store={store}>
                <div>
                    {this.getRoutes(store)}
                    {this.getDevTools()}
                </div>
            </Provider>
        );
    }
}

export default Container
