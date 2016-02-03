/**
 * Created by tutu on 15-12-25.
 */

/// <reference path="../../../../libs/ts/immutable.d.ts" />
/// <reference path="../../../../typings/react/react.d.ts" />
/// <reference path="../../../../typings/react-redux/react-redux.d.ts" />

import * as React from "react";
import { Provider } from "react-redux";
import MainStore from "../store/MainStore";
import App from "./App";
import DevTools from "./DevTools";

interface ContainerProp {
    data:any
}

const store = MainStore();

class Container extends React.Component<ContainerProp, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render() {
        return (
            <Provider store={store}>
                <div>
                    <App data={this.props.data}/>
                    <DevTools/>
                </div>
            </Provider>
        );
    }
}

export default Container
