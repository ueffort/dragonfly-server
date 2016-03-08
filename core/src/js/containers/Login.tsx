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

interface LoginProp {
    loading?: any;
    user?: any;
    style?: any;
    actions?: any;
}

interface LoginState {
    email?: string;
    password?: string;
}

class Login extends React.Component<LoginProp, LoginState> {

    constructor(props: any, context: LoginState) {
        super(props, context);
        this.state = {email: "", password: ""};
        this.init();
    }

    private init(){
        if(this.props.user.email){
            this.props.actions.router("/");
        }
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
                        <h2 style={titleStyle}>登录</h2>
                        <TextField
                            hintText="name@limei.com"
                            floatingLabelText="email"
                            type="text"
                            onChange={this.__email.bind(this)}
                        />
                        <br/>
                        <TextField
                            hintText="******"
                            floatingLabelText="Password"
                            type="password"
                            onChange={this.__password.bind(this)}
                        />
                        <div style={buttonStyle}>
                            <FlatButton style={{float: "left"}}
                                        label="登录"
                                        secondary={true}
                                        keyboardFocused={true}
                                        onTouchTap={this.__login.bind(this)}/>
                            <FlatButton style={{float: "right"}}
                                        label="注册"
                                        primary={true}
                                        onTouchTap={this.__register.bind(this)}/>
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
        this.props.actions.login(this.state.email, md5(this.state.password));
    }

    private __register(){
        this.props.actions.router("register");
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
)(Login)
