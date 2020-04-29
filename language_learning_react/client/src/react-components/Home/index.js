import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { withRouter } from "react-router-dom";
import Input from "./Input";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import "./styles.css";
import { handleSignIn, handleInputChange } from "../../actions/login";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //input username
      username: "",
      //input password
      password: "",
      // indicate whether we should display the error for the wrong credential
      error: 0
    };
    this.props.history.push("/")
  }

  //Go to signup page
  handleSignUp = () => {
    this.props.history.push("/signup");
  };

  render() {
    return (
      <Container className="home">
        <Grid container className="home_container" spacing={0}>
          <Paper className="welcome_paper">
            <img
              src={require("./../Header/static/logo.png")}
              alt="logo"
              className="Header_logo"
            ></img>
            <span className="welcome-title">Welcome</span>
            <span className="name-title">Spanish Flashcard</span>
          </Paper>
          <Paper className="login_paper">
            <Avatar>
              <LockOutlinedIcon />
            </Avatar>
            <Typography align="center" component="h1" variant="h5">
              Sign in
              {this.state.error === 1 && (
                <p className="logInError">
                  Your login credentials could not be verified, please try
                  again.
                </p>
              )}
            </Typography>
            <form className="login_form">
              <Input
                name="username"
                label="username"
                value={this.state.username}
                onChange={e => handleInputChange(e, this)}
              />

              <Input
                label="password"
                type="password"
                value={this.state.password}
                name="password"
                onChange={e => handleInputChange(e, this)}
              />
              <Grid item>
                <Button
                  id="login_button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  name="login"
                  type="submit"
                  onClick={(e) =>{
                    handleSignIn(e,this.state.username, this.state.password, this, this.props.app)
                  }
                  }
                >
                  Sign In
                </Button>
              </Grid>
              <Grid item className="signup_grid">
                <Link
                  id="signup_link"
                  variant="body2"
                  name="signup"
                  onClick={this.handleSignUp}
                >
                  {"Don't have an account? Sign up"}
                </Link>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Container>
    );
  }
}

export default withRouter(Home);
