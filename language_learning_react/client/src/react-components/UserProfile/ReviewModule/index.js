import React from "react";
import { uid } from "react-uid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import Words from "./../Words";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import UserInput from "../UserInfo/Input";
import { IconButton } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import {getAllLib} from "../../../actions/recommend"
import "./styles.css";
import {getReviewLib,deleteLib,updateUerForm} from "../../../actions/profile";
import {addLib} from "../../../actions/dictionary";

class ReviewModule extends React.Component {
  state = {
    // in review module, user can choose to learn again the word
    moduleName: "Learn again",
    libId: this.props.libraries[0]._id,
    // words need to reveiw from default library
    Words: this.props.libraries[0].words.filter(w => !w.learnStatus),
    selectedIndex: uid(this.props.libraries[0]),
    libCreate:false,
    libName: ""
  };
  
  // handle a click to create a new library
  handleLibCreateClick = () => {
    this.setState({
      libCreate: true
    });
  };

  // handle a click to save a new created library
  handleCreateSave = (profileComponent) => {
    //use server call to add a new library to library database
    addLib(this)
    // update the libraries
    getAllLib(profileComponent) 
  };
  render() {
    
    const { libraries , panelComponent,profileComponent} = this.props;

    return (
      <div className = "learn_module">
        <div className = "libname_list">
          {/* display every library */}
          <List >
            {libraries.map(lib => (              
                <ListItem 
                  key={uid(lib)}
                  button 
                  selected={this.state.selectedIndex === uid(lib)}
                  // server call to get the words need to review from selected library
                  onClick={() => getReviewLib(this,lib._id, uid(lib))}
                  >
                  <ListItemText  primary={lib.name} />
                  <ListItemSecondaryAction>

                    {/* Library Deletion (cannot delete default library) */}
                    {lib.name !== "default" && (
                      <Tooltip title="Delete this library" aria-label="delete">
                        {/* server call to delete a selected library with its _id */}
                        <IconButton color="secondary" onClick={() => deleteLib(lib._id, profileComponent)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
            ))}

            {/* Library Creation */}
            {!this.state.libCreate && (
              <ListItem >
                  <ListItemIcon>
                    <IconButton onClick={this.handleLibCreateClick}>
                      <AddIcon id="addIcon" />
                    </IconButton>
                  </ListItemIcon>
                <ListItemText primary="Create a new library" />
              </ListItem>
            )}
            {this.state.libCreate && (
              <ListItem>
                <React.Fragment>
                  <UserInput
                    name="libName"
                    label="libName"
                    value={this.state.libName}
                    onChange={e => updateUerForm(this, e.target)}
                  />
                  <IconButton id="addButton" onClick={() => this.handleCreateSave(profileComponent)}>
                    <SaveIcon id="addIcon" />{" "}
                  </IconButton>
                </React.Fragment>
              </ListItem>
            )}
          </List>
        </div>

        {/* display all words need to review from selected libray*/}
        <div className="learnword-list">
          <Table >
            <TableBody>
              {/* pass every word to the Words component */}
              {this.state.Words.map(word => (
                <Words
                  key={uid(
                    word
                  )} 
                  word={word}
                  libId={this.state.libId}
                  moduleName={this.state.moduleName}
                  moduleComponent={this}
                  panelComponent={panelComponent}
                  profileComponent={profileComponent}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
    );
  }
}
export default ReviewModule;
