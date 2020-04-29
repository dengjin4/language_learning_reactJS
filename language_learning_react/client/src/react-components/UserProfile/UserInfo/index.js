import React from "react";

import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import UserInput from "./Input";
import Typography from "@material-ui/core/Typography";
import {
  updateUerForm,
  saveUser,
  addImage,
  changePass
} from "../../../actions/profile";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ImageIcon from "@material-ui/icons/Image";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import LockIcon from "@material-ui/icons/Lock";
import "./styles.css";

class UserInfor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameEdit: false,
      passEdit: false,
      name: "",
      password: "",
      message: { type: "", body: "" }
    };
  }

  handleNameEditClick = () => {
    this.setState({
      nameEdit: true
    });
  };

  handlePassEditClick = () => {
    this.setState({
      passEdit: true
    });
  };

  render() {
    const { appComponent } = this.props;
    // this UserInfor component allow user to change user name, password and upload avator
    return (
      <React.Fragment>
        <List>
          <ListItem>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <React.Fragment>
                  <Typography variant="h6">User Name</Typography>
                </React.Fragment>
              }
            />
            {/* If user doesn't click the edit button, shows the user name */}
            {!this.state.nameEdit && (
              <ListItemText
                id="name"
                primary={
                  <React.Fragment>
                    <Typography variant="h6">{appComponent.state.user}</Typography>
                  </React.Fragment>
                }
              />
            )}
            {!this.state.nameEdit && (
              <ListItemSecondaryAction>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={this.handleNameEditClick}
                >
                  Edit
                </Button>
              </ListItemSecondaryAction>
            )}

            {/* else, user can input the new user name and save it */}
            {this.state.nameEdit && (
              <ListItemText
                primary={
                  <React.Fragment>
                    <UserInput
                      name="name"
                      label="name"
                      value={this.state.name}
                      onChange={e => updateUerForm(this, e.target)}
                    />
                  </React.Fragment>
                }
              />
            )}
            {this.state.nameEdit && (
              <ListItemSecondaryAction>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={() => saveUser(this, appComponent)}
                >
                  Save
                </Button>
              </ListItemSecondaryAction>
            )}
          </ListItem>

          {/* same for the password changing */}
          <ListItem>
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <React.Fragment>
                  <Typography variant="h6">User Password</Typography>
                </React.Fragment>
              }
            />
            {!this.state.passEdit && (
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography variant="h6">*****</Typography>
                  </React.Fragment>
                }
              />
            )}
            {!this.state.passEdit && (
              <ListItemSecondaryAction>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={this.handlePassEditClick}
                >
                  Edit
                </Button>
              </ListItemSecondaryAction>
            )}

            {this.state.passEdit && (
              <ListItemText
                primary={
                  <React.Fragment>
                    <UserInput
                      name="password"
                      label="password"
                      value={this.state.password}
                      onChange={e => updateUerForm(this, e.target)}
                    />
                  </React.Fragment>
                }
              />
            )}
            {this.state.passEdit && (
              <ListItemSecondaryAction>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={() => changePass(this)}
                >
                  Save
                </Button>
              </ListItemSecondaryAction>
            )}
          </ListItem>

          {/* Upload user profile image */}
          <ListItem>
            <ListItemIcon>
              <ImageIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <React.Fragment>
                  <Typography variant="h6">Profile Image</Typography>
                </React.Fragment>
              }
            />

            <ListItemText
              primary={
                <React.Fragment>
                  <form
                    className="image-form"
                    onSubmit={e => {
                      e.preventDefault();
                      addImage(e.target, this, appComponent);
                    }}
                  >
                    <div className="uploadbutton">
                      <Button
                        variant="contained"
                        id="image-form__submit-button"
                        color="primary"
                        type="submit"
                        startIcon={<CloudUploadIcon />}
                      >
                        Upload
                      </Button>
                    </div>
                    <div className="choosefile">
                      <input name="image" type="file" />
                    </div>
                   
                  </form>
                </React.Fragment>
              }
            />
          </ListItem>
        </List>
        {/* message shows edit status: success or error */}
        <p className={`image-form__message--${this.state.message.type}`}>
          {this.state.message.body}
        </p>
      </React.Fragment>
    );
  }
}

export default UserInfor;
