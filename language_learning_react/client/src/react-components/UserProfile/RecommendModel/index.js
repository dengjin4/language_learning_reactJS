import React from "react";
import { uid } from "react-uid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import Words from "../Words";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import { getLearnLib, deleteLib } from "../../../actions/profile";
import "./styles.css";
import {
  getAllLib,
  getAllDefault,
  addWord,
  addDefaultWord
} from "../../../actions/recommend";
import { IconButton } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import MenuItem from "@material-ui/core/MenuItem";
import StarIcon from "@material-ui/icons/Star";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import Menu from "@material-ui/core/Menu";

class RecommendModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      libraries: [], // the module name that the user want to move to
      words: [],
      selectedWord: null,
      anchorEl: null,
      reload: false
    };
    getAllLib(this);
    getAllDefault(this);
    this.saveWord.bind(this);
  }

  //handle a click to the saveIcon
  handleSave = lib_id => {
    const word = this.state.selectedWord;
    addDefaultWord(word, lib_id, this, this.props.profileComponent);
    this.handleClose();
  };

  handleClick = (event, word) => {
    this.setState({
      selectedWord: word,
      anchorEl: event.currentTarget
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  allLibs = () => {
    return (
      <React.Fragment>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
        >
          {this.state.libraries.map(lib => (
            <MenuItem
              key={uid(lib)}
              onClick={() => {
                this.handleSave(lib._id);
              }}
            >
              {lib.name}
            </MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    );
  };

  saveWord = word => {
    console.log("add", word);
    if (word.saved) {
      return (
        <TableRow className="word" key={word.word}>
          <TableCell align="center" component="th" scope="row">
            <Typography variant="h6">{word.source.toUpperCase()}</Typography>
          </TableCell>

          <TableCell align="center" component="th" scope="row">
            <Typography variant="h6">{word.word}</Typography>
          </TableCell>

          <TableCell align="center" component="th" scope="row">
            <div id="saved">
              Saved
              <StarIcon id="star" />
            </div>
          </TableCell>
        </TableRow>
      );
    } else {
      return (
        <TableRow className="word" key={word.word}>
          <TableCell align="center" component="th" scope="row">
            <Typography variant="h6">{word.source.toUpperCase()}</Typography>
          </TableCell>
          <TableCell align="center" component="th" scope="row">
            <Typography variant="h6">{word.word}</Typography>
          </TableCell>

          <TableCell align="center" component="th" scope="row">
            <IconButton
              id="addButton"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={e => this.handleClick(e, word)}
            >
              <AddCircleOutlineIcon id="addIcon" /> <span id="add">Save</span>
            </IconButton>
            {this.allLibs()}
          </TableCell>
        </TableRow>
      );
    }
  };

  render() {
    return (
      <div className="learnword-list">
        <Table>
          <TableBody>
            {this.state.words.map(word => {
              return this.saveWord(word);
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}
export default RecommendModel;
