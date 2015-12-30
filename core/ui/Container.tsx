/**
 * Created by tutu on 15-12-25.
 */

/// <reference path="../../typings/react/react.d.ts" />

import * as React from "react";

interface Prop {
  key: string;
}

// Defines the interface of the state of the TodoItem component
interface State {
  editText: string;
}
export class Container extends React.Component<Prop, State> {

    constructor(props, context) {
      super(props, context);

    }
    public render() {
        return (<h1>hello</h1>);
    }
}
