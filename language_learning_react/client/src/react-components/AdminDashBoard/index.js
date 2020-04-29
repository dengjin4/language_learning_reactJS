import React from "react";
import "./dashboard.css";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Wordbox from "./WordBox";
import AdminHeader from "../Header/adminHeader.js";
import { getAllUsers, getAllRecommend } from "../../actions/getAllUsers";
import { suspendUser, changePassword } from "../../actions/updateUser";
import { getAllDefault } from "../../actions/getAllDefault";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";

/* The Dashboard Component */
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      showUser: "stats",
      currentSearch: "",
      currentUser: "",

      userList: [],
      wordList: [],
      defaultList: [],
      curTime: "00:00:00",
    };
    this.props.history.push("/admin");
  }

  // function to get all users, default words and pending recommend word
  componentDidMount() {
    getAllUsers(this);
    getAllRecommend(this);
    getAllDefault(this);
    setInterval(() => {
      let time = new Date();
      this.setState({
        curTime:
          time.getHours().toLocaleString() +
          ":" +
          time.getMinutes().toLocaleString() +
          ":" +
          time.getSeconds().toLocaleString(),
      });
    }, 1000);
  }

  // function used to record and change the input when user type in something
  handleInput = (event) => {
    const target = event.target;
    const value = target.value;
    this.setState({
      searchValue: value,
    });
  };

  // funtion for admin to key in name and serch the user
  searchUser = (users, event) => {
    const key = event.which || event.keyCode;
    if (key === 13) {
      const input = this.state.searchValue;
      this.setState({
        currentSearch: input,
      });
      let found = false;
      let user;
      for (let i = 0; i < users.length; i++) {
        if (users[i].type !== "admin") {
          if (users[i].name.toUpperCase() === input.toUpperCase()) {
            found = true;
            user = users[i];
          }
        }
      }
      if (found) {
        this.setState({
          showUser: "one user",
          currentUser: user,
        });
      } else {
        this.setState({
          showUser: "stats",
        });
        alert("User not found");
      }
    }
  };

  // Search user using search button only

  searchUserbutton = (users) => {
    const input = this.state.searchValue;
    this.setState({
      currentSearch: input,
    });
    let found = false;
    let user;
    for (let i = 0; i < users.length; i++) {
      if (users[i].type !== "admin") {
        if (users[i].name.toUpperCase() === input.toUpperCase()) {
          found = true;
          user = users[i];
        }
      }
    }
    if (found) {
      this.setState({
        showUser: "one user",
        currentUser: user,
      });
    } else {
      this.setState({
        showUser: "stats",
      });
      alert("User not found");
    }
  };

  // function related to the button to change the board
  searchAllUser = () => {
    this.setState({
      showUser: "all user",
    });
  };
  // function related to the button to change the board
  searchWord = () => {
    this.setState({
      showUser: "all word",
    });
  };
  // function related to the button to change the board
  showStat = () => {
    this.setState({
      showUser: "stats",
    });
  };

  showDef = () => {
    this.setState({
      showUser: "def",
    });
  };

  // function use to control the switch and suspend the user
  handleSuspend = (user) => {
    if (user.suspend) {
      user.suspend = false;
    } else {
      user.suspend = true;
    }
    suspendUser(user.name);
    this.setState({
      currentUser: user,
    });
  };

  // fucntion used to generate random password
  generatePassword = (username) => {
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    let message = "The password is change to " + retVal;
    changePassword(username, retVal);
    alert(message);
  };

  render() {
    //************************************** Attributes update ***********************************************
    let userOnline = 0;
    for (let i = 0; i < this.state.userList.length; i++) {
      if (this.state.userList[i].login) {
        userOnline += 1;
      }
    }

    const attributes1 = [
      { name: "Total user:", value: this.state.userList.length - 1 },
      {
        name: "Words in default library:",
        value: this.state.defaultList.length,
      },
      { name: "Total pending words:", value: this.state.wordList.length },
    ];

    const attributes2 = [
      {
        name: "User offline",
        value: this.state.userList.length - userOnline,
      },
      { name: "User online:", value: userOnline - 1 },
      { name: "Time:", value: this.state.curTime },
    ];

    let innerboard1 = attributes1.map((att) => (
      <div className="dashbox">
        <div className="dashboxinner">
          <h4>{att.name}</h4>
          <h2>{att.value}</h2>
        </div>
      </div>
    ));

    let innerboard2 = attributes2.map((att) => (
      <div className="dashbox">
        <div className="dashboxinner">
          <h4>{att.name}</h4>
          <h2>{att.value}</h2>
        </div>
      </div>
    ));
    //******************** Attributes update end ************************************

    //*********************************** board start  ************************************************* */
    let board;
    // show case
    if (this.state.showUser === "one user") {
      board = (
        <div className="board">
          <div className="upper">
            <img
              className="smallimg"
              alt="profile"
              src={this.state.currentUser.image_url}
            />
          </div>

          <div className="lower">
            <p className="userName">{this.state.currentUser.name}</p>
            <div className="bcontainer">
              <FormControlLabel
                className="SuspendB"
                control={
                  <Switch
                    onChange={this.handleSuspend.bind(
                      this,
                      this.state.currentUser
                    )}
                    checked={this.state.currentUser.suspend}
                  />
                }
                label="Suspend"
              />

              <Button
                className="SuspendB"
                variant="outlined"
                color="primary"
                onClick={this.generatePassword.bind(
                  this,
                  this.state.currentUser.name
                )}
              >
                Change Password
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // stat case(stats)
    else if (this.state.showUser === "stats") {
      board = (
        <div id="defaultBoard">
          <div className="container">
            <div className="dashbox"></div>
            {innerboard1}
            <div className="dashbox"></div>
          </div>
          <div className="container">
            <div className="dashbox"></div>
            {innerboard2}
            <div className="dashbox"></div>
          </div>
        </div>
      );
    } else if (this.state.showUser === "def") {
      board = (
        <div className="board">
          <Wordbox
            app={this}
            pendingList={this.state.defaultList}
            flag={false}
          />
        </div>
      );
    }

    // all user case
    else if (this.state.showUser === "all user") {
      let copyUsers = this.state.userList;
      copyUsers.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      let tempUserList = [];
      let color = 0;
      for (let i = 0; i < copyUsers.length; i++) {
        if (copyUsers[i].name !== "admin") {
          if (color === 0) {
            tempUserList.push([copyUsers[i], "switch1"]);
          } else {
            tempUserList.push([copyUsers[i], "switch"]);
          }
          color = (color + 1) % 2;
        }
      }
      board = (
        <div className="allUserBoard">
          {tempUserList.map((user) => (
            <div className={user[1]}>
              <div className="ssmallimgC">
                <img
                  className="ssmallimg"
                  alt="profile"
                  src={user[0].image_url}
                />
              </div>
              <div className="smallUserName">
                <p>{user[0].name}</p>
              </div>
              <div className="smallSuspend">
                <p>Suspend: {user[0].suspend.toString()}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }
    // all recommend word case
    else if (this.state.showUser === "all word") {
      board = (
        <div className="board">
          <Wordbox app={this} pendingList={this.state.wordList} flag={true} />
        </div>
      );
    }

    //******************************************   board end  *************************************************************** */
    return (
      <div>
        <AdminHeader app={this.props.app} />
        <div className="adminHeader"></div>
        <div className="robot">
          <img id="profileImg" alt="bot" src={require("./static/bot.png")} />
        </div>

        {/* search box where admin could search up user */}
        <div>
          <div className="searchBox">
            <div className="buttonLeft">
              <IconButton
                id="searchIcon"
                onClick={this.searchUserbutton.bind(this, this.state.userList)}
                aria-label="search"
                type="submit"
                color="inherit"
              >
                <SearchIcon />
              </IconButton>
            </div>
            <input
              className="inputbox"
              type="text"
              placeholder="Search User"
              onChange={(event) => this.handleInput(event)}
              onKeyDown={this.searchUser.bind(this, this.state.userList)}
            />

            <div>
              

              <div className="buttonC">
                <Button
                  variant="contained"
                  onClick={this.searchWord.bind(this, this.state.userList)}
                  color="primary"
                >
                  pending words
                </Button>
              </div>

              <div className="buttonC">
                <Button
                  variant="contained"
                  onClick={this.showStat.bind(this)}
                  color="primary"
                >
                  stats
                </Button>
              </div>

              <div className="buttonC">
                <Button
                  variant="contained"
                  onClick={this.showDef.bind(this, this.state.userList)}
                  color="primary"
                >
                  default lib
                </Button>
              </div>

              <div className="buttonC">
                <Button
                  variant="contained"
                  onClick={this.searchAllUser.bind(this, this.state.userList)}
                  color="primary"
                >
                  All user
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* board here*/}
        {board}
      </div>
    );
  }
}

export default Dashboard;
