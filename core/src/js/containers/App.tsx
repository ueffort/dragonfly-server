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
import Header from "./Header";
import Left from "./Left";
import Message from "./Message";
import Content from "./Content";
import Platform from "../tools/Platform";

interface AppProp {
    playbook?: any;
    loading?: any;
    user?: any;
    style?: any;
    actions?: any;
    params?: any;
}

class App extends React.Component<AppProp, any> {

    constructor(props: any, context: any) {
        super(props, context);
        this.init();
    }

    private init(){
        if(!this.props.user.email){
            this.props.actions.router("login");
        }
    }

    private updateDimensions() {
        Platform.getPlatform().init();
        this.setState({update:true});
    }

    public componentDidMount() {
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    public render() {
        return (
            <div>
                <Header title={this.props.playbook[0].name}
                        userName={this.props.user.email}
                        menuAction={this.props.actions.leftShow}/>
                <Left show={this.props.style.left}
                      showAction={this.props.actions.leftShow}
                      routerAction={this.props.actions.router}/>
                <Content playbook={this.props.playbook}
                         routerAction={this.props.actions.router}
                         id={this.props.params.id}
                         type={this.props.params.type}/>
                <Loading loading={this.props.loading.isLoad}/>
                <Message message={this.props.style.message} closeAction={this.props.actions.message}/>
            </div>
        );
    }
}

function mapStateToProps(state: any) {
    return {
        playbook: state.PlayBook,
        loading: state.Loading,
        user: state.User,
        style: state.Style
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
