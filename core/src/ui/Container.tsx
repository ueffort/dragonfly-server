/**
 * Created by tutu on 15-12-25.
 */

/// <reference path="../../../typings/react/react.d.ts" />

import * as React from "react";

interface ContainerProp {
    name: string;
}

// Defines the interface of the state of the TodoItem component
interface State {
}
export class Container extends React.Component<ContainerProp, State> {

    constructor(props, context) {
      super(props, context);

    }
    public render() {
        return (<h1>hello {this.props.name}</h1>);
    }
}

export default Container
