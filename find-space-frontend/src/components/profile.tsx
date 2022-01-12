import React from "react";
import { Link } from "react-router-dom";
import { User, UserAttributes } from "../models/model";
import { AuthService } from "../services/authService";

interface ProfileState{
    userAttributes:UserAttributes[]
};

interface ProfileProps{
    user:User|undefined,
    authService:AuthService
};

export class Profile extends React.Component<ProfileProps,ProfileState>{
    state: ProfileState={
        userAttributes:[]
    };

    async componentDidMount(){
        if (this.props.user) {
            const userAttributes=await this.props.authService.getUserAttributes(this.props.user);
            this.setState({
                userAttributes:userAttributes
            })
        } 
    }
    private renderUserAttributes(){
        const rows=[];
        for(const userAttribute of this.state.userAttributes){
            rows.push(
                <tr key={userAttribute.Name}>
                    <td>{userAttribute.Name}</td>
                    <td>{userAttribute.Value}</td>
                </tr>
            );
        };
        return <table>
            <tbody>
                {rows}
            </tbody>
        </table>
    }
    render(): React.ReactNode {
        let profileSpace;
        if (this.props.user) {
            profileSpace=<div>
                <h3> hello {this.props.user.userName}</h3>
                Here are your UserAttributes:
                {this.renderUserAttributes()}
                </div>
        } else {
            profileSpace=<div>
                Please <Link to='/login' >Login</Link>
            </div>
        }
        return (
            <div>
                Welcome to profile page
                {profileSpace}
            </div>
        )
    }
}