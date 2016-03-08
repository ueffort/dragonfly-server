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
import Paper = require('material-ui/lib/paper');
import TextField = require('material-ui/lib/text-field');
import FlatButton = require('material-ui/lib/flat-button');
import {md5} from "../../../../app/tools/StringHandle";
import Message from "./Message";

interface RegisterProp {
    loading?: any;
    user?: any;
    style?: any;
    actions?: any;
}

interface RegisterState {
    email?: string;
    password?: string;
}

class Register extends React.Component<RegisterProp, RegisterState> {

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {email: "", password: ""};
    }

    public render () {
        let style = {position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"};
        let paperStyle = {padding: 30};
        let buttonStyle = {marginTop: 40, textAlign: "center", overflow: "hidden"};
        let titleStyle = {textAlign: "center"};
        return (
            <div>
                <div style={style}>
                    <Paper style={paperStyle} zDepth={2}>
                        <h2 style={titleStyle}>注册</h2>
                        <TextField
                            hintText="name@limei.com"
                            floatingLabelText="email"
                            type="text"
                        />
                        <br/>
                        <TextField
                            hintText="******"
                            floatingLabelText="Password"
                            type="password"
                        />
                        <br/>
                        <TextField
                            hintText="******"
                            floatingLabelText="Password"
                            type="password"
                        />
                        <div style={buttonStyle}>
                            <FlatButton style={{float: "left"}}
                                        label="注册"
                                        secondary={true}
                                        keyboardFocused={true}
                                        onTouchTap={this.__register.bind(this)}/>
                            <FlatButton style={{float: "right"}}
                                        label="登录"
                                        primary={true}
                                        onTouchTap={this.__login.bind(this)}/>
                        </div>
                    </Paper>
                </div>
                <Loading loading={this.props.loading.isLoad}/>
                <Message message={this.props.style.message} closeAction={this.props.actions.message}/>
            </div>
        );
    }
    private __email(event: any){
        this.setState({email: event.target.value})
    }

    private __password(event: any){
        this.setState({password: event.target.value})
    }

    private __login(){
        this.props.actions.router("login");
    }

    private __register(){
        this.props.actions.register(this.state.email, md5(this.state.password));
    }
}

function mapStateToProps(state: any) {
    return {
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
)(Register)
