import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { withRouter } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import SearchIcon from "@material-ui/icons/Search";
import Grid from "@material-ui/core/Grid";
import { uid } from "react-uid";
import "./header.css";
import { Redirect } from "react-router-dom";
import { logout } from "../../actions/app";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // mainly for the search bar
      refresh: false,
      source: "En",
      word: "",
      languages: ["Es", "En"],
      redirect: false,
    };
    // check whether the page is directed from other page or
    // directed from the dictionary page. If it is from the dictionary page,
    // we need to reload the page
    if (props.reload) {
      this.state.refresh = true;
    }
  }
  
  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value // [name] sets the object property name to the value of the 'name' variable.
    });
  };
  //indicate that we should direct to dictionary page
  handleSubmit = event => {
    this.setState({
      redirect: true
    });
  };
  //format the user's input word
  formatedWord = () => {
    let word = this.state.word.trim();
    if (word === "") {
      return "dictionary";
    }
    word = word.toLowerCase();
    return word;
  };
  //redirect to the dictionary page
  renderRedirect = () => {
    if (this.state.redirect) {
      if (this.state.refresh) {
        // This will handle searching in the dictionary page
        this.props.reload();
        return (
          <Redirect
            to={{
              pathname:
                "/dictionary/" + this.formatedWord() + "_" + this.state.source,
              state: { word: this.formatedWord(), source: this.state.source }
            }}
          />
        );
      } else {
        return (
          // This will handle searching out side the dictionary page
          <Redirect
            to={{
              pathname:
                "/dictionary/" + this.formatedWord() + "_" + this.state.source,
              state: { word: this.formatedWord(), source: this.state.source }
            }}
          />
        );
      }
    }
  };
  // handle logout
  handleLogoutClick = (app) => {
    logout(app,this);
  };
  // redirect to home page
  handleHomeClick = () => {
    this.props.history.push("/mainpage");
  };

  render() {
    const {app} = this.props;
    return (
      <div className="Header">
        {this.renderRedirect()}
        <AppBar className="Header_AppBar">
          <Toolbar>
            <IconButton color="inherit" onClick={this.handleHomeClick}>
              <HomeIcon id="homeIcon" />
            </IconButton>
            <Typography variant="h6" className="Header_title">
              Spanish FlashCard
            </Typography>
            <Grid
              id="searchBar"
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={1}
            >
              <Grid item xs={1}>
                <TextField
                  select
                  id="source"
                  name="source"
                  variant="outlined"
                  value={this.state.source}
                  onChange={this.handleInputChange}
                >
                  {this.state.languages.map(option => (
                    <MenuItem key={uid(option)} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id="searchWord"
                  variant="outlined"
                  fullWidth
                  name="word"
                  value={this.state.word}
                  onChange={this.handleInputChange}
                  placeholder="look up a word here!"
                ></TextField>
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  id="searchIcon"
                  onClick={this.handleSubmit}
                  aria-label="search"
                  type="submit"
                  color="inherit"
                >
                  <SearchIcon />
                </IconButton>
              </Grid>
            </Grid>

            <div className="Header_userwrapper">
              <Link variant="body2" to={"/profile"}>
                {/* <Avatar alt="user imag" src={require("./static/user.jpg")} /> */}
                <Avatar alt="user imag" src={app.state.image} />
              </Link>
            </div>

            <IconButton id="logout" color="inherit" onClick={() => this.handleLogoutClick(app)}>
              <ExitToAppIcon id="logoutIcon" />
              <span id="logoutText">Log out</span>
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withRouter(Header);
