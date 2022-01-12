import React, { SyntheticEvent } from "react";
import { User } from "../models/model";
import { AuthService } from "../services/authService";
import history from '../utils/history';

interface LoginProps {
    authService: AuthService,
    setUser:(user:User)=>void
}

interface LoginState {
    userName:string,
    password:string,
    loginAttempted:boolean,
    loginSuccessful:boolean
}

interface CustomEvent {
    target:HTMLInputElement
}
export class Login extends React.Component <LoginProps, LoginState>{

    state: LoginState = {
        userName:'',
        password:'',
        loginAttempted:false,
        loginSuccessful:false
    }

    private setUserName(event:CustomEvent){
        this.setState({
            userName:event.target.value
        });
    }
    private setPassword(evet:CustomEvent){
        this.setState({
            password:evet.target.value
        });
    }

    private async handleSubmit(event:SyntheticEvent){
        event.preventDefault();

        const result=await this.props.authService.login(
            this.state.userName,
            this.state.password
            );
        if(result){
            this.setState({
                loginAttempted:true,
                loginSuccessful:true
            });
            this.props.setUser(result);
            history.push('/profile')
        }else{
            this.setState({
                loginAttempted:true,
                loginSuccessful:false
            });
        }
    }

render(): React.ReactNode {
    let loginMessage:any;
    if(this.state.loginAttempted){
        if(this.state.loginSuccessful){
            loginMessage=<label>Login successfule</label>
        }else{
            loginMessage=<label>Login failed</label>
        }
    }
    return(
        <div>
            <h2>Please login</h2>
            <form onSubmit={e=>this.handleSubmit(e)}>
                <input value={this.state.userName} onChange={e=>this.setUserName(e)}/><br/>
                <input value={this.state.password} type='password' onChange={e=>this.setPassword(e)}/><br/>
                <input type='submit' value='Login' />

            </form>
            {loginMessage}
        </div>
    )
}
}