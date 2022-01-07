import React from "react";
import { User } from "../models/model";
import { AuthService } from "../services/authService";
import { Login } from "./login";
import { BrowserRouter as  Router, Route, Routes } from "react-router-dom";
import { NavBar } from "./navbar";
import {Home} from './home' ;
import { Profile } from './profile' ;
import history from '../utils/history';
import Navigator from '../utils/navigator'

interface AppState {
  user: User | undefined;
}
export class App extends React.Component<{}, AppState> {
  private authService: AuthService = new AuthService();

  constructor(props: any) {
    super(props);
    this.state={
      user:undefined
    }
    this.setUser = this.setUser.bind(this);
  }
  private setUser(user: User) {
    this.setState({
      user: user,
    });
    console.log("Set user " + JSON.stringify(user));
  }

  render(): React.ReactNode {
    return (
    <div className="wrapper">
      <Router>
        <div>
        <NavBar user={this.state.user}/>
        </div>
        <Routes>
          <Route path='/' caseSensitive={false} element={<Home />} />
          <Route path='/login' caseSensitive={false} element={
            <Login authService={this.authService} setUser={this.setUser} />
          } />
          <Route path='/profile' caseSensitive={false} element={<Profile />} />
        </Routes>
      </Router>
    </div>)
      ;
  }
}
