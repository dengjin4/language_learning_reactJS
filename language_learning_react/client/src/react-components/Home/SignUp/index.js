import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { withRouter } from "react-router-dom";
import Input from "./../Input";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import "./styles.css";
import { IconButton, InputAdornment } from "@material-ui/core";
import { submitForm, handleInputChange } from "../../../actions/signup.js";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //input username
      username: "",
      //input password
      password: "",
      //retype password
      rePassword: "",
      //whether to show the password
      showPassword: false,
      //error code
      error: 0
    };
    this.props.history.push("/signup");
  }
  //Handle the show password icon
  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };
  //Handle the show password icon, prevent mouse down
  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  render() {
    return (
      <Container className="signup">
        <Paper className="signup_paper">
          <Avatar className="signup_avatar">
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          {this.state.error === 1 && (
            <p className="signUpError">
              Your password doesn't match, please try again.
            </p>
          )}
          <form className="signup_form">
            <Input
              name="username"
              label="username"
              value={this.state.username}
              onChange={e => handleInputChange(e, this)}
            />

            <Input
              label="password"
              value={this.state.password}
              name="password"
              onChange={e => handleInputChange(e, this)}
              type={this.state.showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={this.handleClickShowPassword}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {this.state.showPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Input
              label="Repeat Password"
              value={this.state.rePassword}
              name="rePassword"
              onChange={e => handleInputChange(e, this)}
              type={this.state.showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={this.handleClickShowPassword}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {this.state.showPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Grid item>
              <Button
                id="signup_button"
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={e => submitForm(e, this)}
              >
                Sign Up
              </Button>
            </Grid>
            <Grid container justify="flex-end">
              <Grid item>
                <Link variant="body2" to={"/"}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    );
  }
}

export default withRouter(SignUp);
