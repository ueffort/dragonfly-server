/**
 * Created by tutu on 15-12-25.
 */

/// <reference path="../../../../libs/ts/immutable.d.ts" />
/// <reference path="../../../../typings/react/react.d.ts" />
/// <reference path="../../../../typings/react-redux/react-redux.d.ts" />
/// <reference path="../../../../typings/react-router/react-router.d.ts" />
/// <reference path="../../../../typings/history/history.d.ts" />

import * as React from "react";
import { Provider } from "react-redux";
import MainStore from "../store/MainStore";
import App from "./App";
import DevTools from "./DevTools";
import {createHistory, createMemoryHistory} from 'history';
import { IndexRoute, Route, Router, browserHistory, useRoutes } from 'react-router';
import { syncHistory, routeReducer } from 'react-router-redux'

interface ContainerProp {
    data:any;
}


class Container extends React.Component<ContainerProp, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    private getDevTools(){
        if(this.props.data.debug){
            return <DevTools/>
        }
    }

    private getStore(){
        if(typeof window == "object"){
            const reduxRouterMiddleware = syncHistory(browserHistory);
            const store = MainStore(this.props.data.debug, this.props.data.props, [reduxRouterMiddleware]);
            reduxRouterMiddleware.listenForReplays(store);
            return store;
        }else{
            return MainStore(this.props.data.debug, this.props.data.props, []);
        }
    }

    private getRoutes(){
        if(typeof window == "object"){
            return (
                <Router history={browserHistory}>
                    <Route path="*" component={App}>
                        <IndexRoute component={App}/>
                    </Route>
                </Router>
            );
        }else{
            return (
                <Router history={useRoutes(createMemoryHistory)()}>
                    <Route path="*" component={App}>
                        <IndexRoute component={App}/>
                    </Route>
                </Router>
            );
        }
    }

    public render() {
        return (
            <Provider store={this.getStore()}>
                <div>
                    {this.getRoutes()}
                    {this.getDevTools()}
                </div>
            </Provider>
        );
    }
}

export default Container
