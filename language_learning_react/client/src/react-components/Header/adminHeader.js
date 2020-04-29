import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { withRouter } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import "./header.css";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { logout } from "../../actions/app";

class AdminHeader extends React.Component {
  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value // [name] sets the object property name to the value of the 'name' variable.
    });
  };
  // Go back to the main page
  handleLogoutClick = (app) => {
    logout(app);
    this.props.history.push({ pathname: "/"});
  };
  render() {
    const {app} = this.props
    return (
      <div className="Header">
        <AppBar className="Header_AppBar">
          <Toolbar>
            <SupervisorAccountIcon id="adminIcon" />
            <Typography variant="h6" className="Header_title">
                   Admin dashboard
            </Typography>

            <IconButton id="logout" color="inherit" onClick={() => this.handleLogoutClick(app)}>
              <ExitToAppIcon id="LogoutIcon" />
              <span id="logoutText">Log out</span>
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withRouter(AdminHeader);
