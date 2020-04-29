import React from "react";
import Card from "@material-ui/core/Card";
// import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
// import Button from "@material-ui/core/Button";
import { uid } from "react-uid";
import Typography from "@material-ui/core/Typography";
import Header from "../Header";
import "./styles.css";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import AddIcon from "@material-ui/icons/Add";
import { IconButton } from "@material-ui/core";
import StarIcon from "@material-ui/icons/Star";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import SaveIcon from "@material-ui/icons/Save";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import UserInput from "../UserProfile/UserInfo/Input";
import ReactAudioPlayer from "react-audio-player";
import {
  reconmmend,
  addWord,
  lookup,
  checkSaved,
  checkRecommendation,
  addLib
} from "../../actions/dictionary";
import { updateUerForm } from "../../actions/profile";
import { getAllLib } from "../../actions/recommend";

class Dictionary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //Get the word from search bar
      source: props.location.state.source,
      word: props.location.state.word,
      translate: "",
      pos: "",
      translations: [{ fl: "", def: [] }],
      status: true,
      recommended: false,
      saved: false,
      libraries: [],
      anchorEl: null,
      libCreate: false,
      libName: "",
      audio: null,
      mw: null,
      sound: false
    };
    lookup(this);
    checkRecommendation(this);
    checkSaved(this);
    //Get translation from server (need a sever call), we can also check whether the word is in the list
    //or is recommended by this user
    this.reload = this.reload.bind(this);
    // console.log(this.state);
    this.props.history.push(
      "/dictionary/" +
        props.location.state.word +
        "_" +
        props.location.state.source
    );
  }

  // get all libraries data
  componentDidMount() {
    getAllLib(this);
  }
  // handle a click to create a new library
  handleLibCreateClick = () => {
    this.setState({
      libCreate: true
    });
  };
  //Refresh the page for searching another word
  reload() {
    window.location.reload();
  }
  // create the audion bar
  audio = () => {
    if (this.state.sound) {
      return (
        <div id="audio">
          <ReactAudioPlayer src={this.state.audio} controls />
        </div>
      );
    }
  };
  // create the recommend icon
  recommendIcon = () => {
    if (!this.state.recommended) {
      return (
        <IconButton id="recommend" onClick={this.handleRecommend}>
          <ThumbUpIcon id="thumbUp" />
          <span id="recommendText">Recommend it</span>
        </IconButton>
      );
    } else {
      return (
        <div id="recommended">
          <span id="recoomendedText">Recommended</span>
          <CheckCircleIcon id="check" />
        </div>
      );
    }
  };
  //handle a cilck to the recommendIcon
  handleRecommend = () => {
    reconmmend(this);
  };

  // handle menu click
  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  // handle menu close
  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };
  //create the save icon
  saveIcon = () => {
    if (!this.state.saved) {
      return (
        <React.Fragment>
          <IconButton
            id="addButton"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            <AddCircleOutlineIcon id="addIcon" />{" "}
            <span id="add">Add to list</span>
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={this.state.anchorEl}
            keepMounted
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleClose}
          >
            {this.state.libraries.map(lib => (
              <MenuItem key={uid(lib)} onClick={() => this.handleSave(lib._id)}>
                {lib.name}
              </MenuItem>
            ))}

            <MenuItem>
              {!this.state.libCreate && (
                <IconButton id="addButton" onClick={this.handleLibCreateClick}>
                  <AddIcon id="addIcon" />{" "}
                  <span id="add">Create a new library</span>
                </IconButton>
              )}
              {this.state.libCreate && (
                <React.Fragment>
                  <UserInput
                    name="libName"
                    label="libName"
                    value={this.state.libName}
                    onChange={e => updateUerForm(this, e.target)}
                  />
                  <IconButton id="addButton" onClick={this.handleCreateSave}>
                    <SaveIcon id="addIcon" />{" "}
                  </IconButton>
                </React.Fragment>
              )}
            </MenuItem>
          </Menu>
        </React.Fragment>
      );
    } else {
      return (
        <div id="saved">
          Saved
          <StarIcon id="star" />
        </div>
      );
    }
  };
  //map the translation to the components in page
  translate = () => {
    return this.state.translations.map(x => (
      <List component="nav" aria-label="main mailbox folders">
        {x ? 
          <div>
            <ListItem>
              <Typography id="pos">{x.fl}</Typography>
            </ListItem>
            {x.def.map(d => (
              <ListItem>
                <Typography id="describe" component="p">
                  {d}
                </Typography>
              </ListItem>
            ))}
          </div>
        :
        <div></div>
        }
      </List>
    ));
  };
  //handle a click to the saveIcon
  handleSave = lib_id => {
    addWord(this, lib_id);
    this.handleClose();
  };

  // handle a click to save new created library
  handleCreateSave = () => {
    console.log(this.state.libName);
    addLib(this);
    getAllLib(this);
    this.handleClose();
  };

  render() {
    const { app } = this.props;
    return (
      <div>
        <Header app={app} reload={this.reload} />
        <br />
        <Card id="vocabularyCard" variant="outlined">
          <CardContent>
            <Typography id="word" component="h1">
              {this.state.word}
            </Typography>
            {this.audio()}
            {this.saveIcon()}
            <Typography id="desTitle" component="h2">
              Definition of {this.state.word}
            </Typography>
            <div id="translation">{this.translate()}</div>

            {this.recommendIcon()}
          </CardContent>
        </Card>
      </div>
    );
  }
}
export default Dictionary;
