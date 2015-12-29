/**
 * Created by tutu on 15-12-25.
 */

/// <reference path="../../typings/react/react.d.ts" />

import * as React from "react"

interface prop {
  key : string
}

// Defines the interface of the state of the TodoItem component
interface state {
  editText : string
}
export class Container extends React.Component<prop,state> {

    constructor(props, context) {
      super(props, context);

    }
    render() {
        return (<h1>hello</h1>);
    }
}
