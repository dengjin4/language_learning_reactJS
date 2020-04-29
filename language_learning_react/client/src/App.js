import React from "react";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import Home from "./react-components/Home";
import Admin from "./react-components/AdminDashBoard";
import Mainpage from "./react-components/Main";
import "./App.css";
import UserProfile from "./react-components/UserProfile";
import Dictionary from "./react-components/Dictionary";
import SignUp from "./react-components/Home/SignUp";
import StudyModule from "./react-components/Study";
import { readCookie, logout } from "./actions/app";

class App extends React.Component {
  constructor(props) {
    super(props);
    readCookie(this);
  }

  state = {
    //Whether this page is reading cookie
    loading: true,
    //The current logged user
    user: null,
    //The type of current user
    type: null,
    //The image for current user
    image: null
  };

  //Redirect to login for ordinary user if not login
  handleRouteForOrd = (page, props) => {
    if (this.state.loading) {
      return null;
    }
    if (!this.state.user) {
      return <Home {...props} app={this} />;
    } else {
      if (this.state.type !== "ord") {
        return (
          <Admin
            {...props}
            app={this}
            handleLogout={this.handleLogout}
            allInfo={this}
            users={this.state.users}
            changeUserPassword={this.changeUserPassword}
          />
        );
      } else {
        return page;
      }
    }
  };

  //Redirect to mainpage for ordinary user
  handleLoginSignupRoute = (page, props) => {
    if (this.state.loading) {
      return null;
    }
    if (this.state.user) {
      if (this.state.type === "admin") {
        return (
          <Admin
            {...props}
            app={this}
            handleLogout={this.handleLogout}
            allInfo={this}
            users={this.state.users}
            changeUserPassword={this.changeUserPassword}
          />
        );
      } else {
        return <Mainpage {...props} app={this} />;
      }
    } else {
      return page;
    }
  };
  //Redirect route for admin
  handleRouteForAdmin = (page, props) => {
    if (this.state.loading) {
      return null;
    }
    if (!this.state.user) {
      return <Home {...props} app={this} />;
    } else {
      if (this.state.type !== "admin") {
        return <Mainpage {...props} app={this} />;
      } else {
        return page;
      }
    }
  };

  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            {" "}
            <Route
              exact
              path="/"
              render={props =>
                this.handleLoginSignupRoute(
                  <Home {...props} app={this} />,
                  props
                )
              }
            />
            <Route
              exact
              path="/signup"
              render={props =>
                this.handleLoginSignupRoute(
                  <SignUp
                    {...props}
                    app={this}
                    allUsers={this.state.users}
                    handleLogin={this.handleLogin}
                    learningLibrary={this.state.defaultList}
                  />,
                  props
                )
              }
            />
            <Route
              exact
              path="/admin"
              render={props =>
                this.handleRouteForAdmin(
                  <Admin
                    {...props}
                    app={this}
                    handleLogout={this.handleLogout}
                    allInfo={this}
                    users={this.state.users}
                    changeUserPassword={this.changeUserPassword}
                  />,
                  props
                )
              }
            />
            <Route
              exact
              path="/mainpage"
              render={props =>
                this.handleRouteForOrd(
                  <Mainpage {...props} app={this} />,
                  props
                )
              }
            />
            <Route
              exact
              path="/profile"
              render={props =>
                this.handleRouteForOrd(
                  <UserProfile {...props} app={this} />,
                  props
                )
              }
            />
            <Route
              path="/dictionary/:word"
              render={props =>
                this.handleRouteForOrd(
                  <Dictionary
                    {...props}
                    app={this}
                    user={this.state.user}
                    updateUser={this.updateUser}
                    defaultList={this.state.defaultList}
                  />,
                  props
                )
              }
            />
            <Route
              exact
              path="/learning"
              render={props =>
                this.handleRouteForOrd(
                  <StudyModule
                    {...props}
                    app={this}
                    learnModule={true}
                  />,
                  props
                )
              }
            />
            <Route
              exact
              path="/review"
              render={props =>
                this.handleRouteForOrd(
                  <StudyModule
                    {...props}
                    app={this}
                    learnModule={false}
                  />,
                  props
                )
              }
            />
            <Route render={() => <div>404 Not found</div>} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
