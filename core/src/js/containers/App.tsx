/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../typings/react/react.d.ts" />
/// <reference path="../../../../typings/redux/redux.d.ts" />
/// <reference path="../../../../typings/react-redux/react-redux.d.ts" />

import * as React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as MainAction from "../actions/MainActions";
import Loading from "./Loading";

interface AppProp {
    playbook?: any;
    loading?: any;
    login?: any;
    actions?: any;
}

class App extends React.Component<AppProp, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render() {
        console.log(this._click);
        return (
            <div>
                <h2 onClick={this._click.bind(this)}>hello {this.props.playbook[0].name}</h2>
                <Loading loading={this.props.loading.isLoad}/>
            </div>
        );
    }

    public _click(){
        console.log(this);
        this.props.actions.router('/login');
    }
}

function mapStateToProps(state: any) {
    return {
        playbook: state.PlayBook,
        loading: state.Loading,
        login: state.Login
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        actions: bindActionCreators(MainAction, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
