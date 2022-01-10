import React from "react";
import { User } from "../models/model";
import { AuthService } from "../services/authService";
import { Login } from "./login";
import { Router, Route, Switch } from "react-router-dom";
import { NavBar } from "./navbar";
import { Home } from "./home";
import { Profile } from "./profile";
import history from "../utils/history";
import { DataService } from "../services/dataService";
import Spaces from "./space/spaces";

interface AppState {
  user: User | undefined;
}
export class App extends React.Component<{}, AppState> {
  private authService: AuthService = new AuthService();
  private dataService:DataService=new DataService();

  constructor(props: any) {
    super(props);
    this.state = {
      user: undefined,
    };
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
        <Router history={history}>
          <div>
            <NavBar user={this.state.user} />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login">
                <Login authService={this.authService} setUser={this.setUser} />
              </Route>
              <Route exact path="/profile">
                <Profile authService={this.authService} user={this.state.user}/>
              </Route>
              <Route exact path="/spaces">
                <Spaces dataService={this.dataService} />
              </Route>
            </Switch>
          </div>
          </Router>
      </div>
    );
  }
}
