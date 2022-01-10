import React from "react";
import { User } from "../models/model";
import {Link} from 'react-router-dom';

export class NavBar extends React.Component<{user:User|undefined}>{

    render(): React.ReactNode {
        let loginLogout:any;
        if(this.props.user){
            loginLogout=<Link to='/logout' style={{float:'right'}}>{this.props.user.userName}</Link>
        }else{
            loginLogout=<Link to='/login' style={{float:'right'}}>Login</Link>
        }
        return (
            <div className="navbar">
                <Link to='/'>Home</Link>
                <Link to='/profile'>Profile</Link>
                <Link to='/spaces'>Spaces</Link>
                {loginLogout}
            </div>
        )
    }
}