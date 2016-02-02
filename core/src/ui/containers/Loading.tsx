/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../typings/react/react.d.ts" />
/// <reference path="../../../../typings/redux/redux.d.ts" />
/// <reference path="../../../../typings/react-redux/react-redux.d.ts" />
/// <reference path="../../../../typings/classnames/classnames.d.ts" />

import * as React from "react";
import * as classNames from "classnames";

interface LoadingProp {
    loading: boolean;
}

class Loading extends React.Component<LoadingProp, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render () {
        let className = classNames("c-loading", {show: this.props.loading}, {hide: !this.props.loading});
        console.log(className);
        return (
            <div className={className}>
                <div className="c-loading-img"></div>
            </div>
        );
    }
}
export default Loading
