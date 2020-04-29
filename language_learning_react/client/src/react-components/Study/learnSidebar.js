import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
// import Divider from "@material-ui/core/Divider";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import Button from "@material-ui/core/Button";

import "./styles.css";

class LearnSidebar extends React.Component {

  //a button click to switch between the libraries to see different cards in different library
  //update the current library for current user using server call
  handleClick(libId){
    this.props.changeLibrary(this.props.learncards, libId);
  }

  learnList = () => {
    return (
      <List aria-label="learning">
        {this.props.learncards.props.libraries.map(lib => (
          <ExpansionPanel className="LibraryPanel">
            <ExpansionPanelSummary><strong>{lib.name}</strong></ExpansionPanelSummary>
            <Button 
              className="Flashcards-button"
              color="primary" 
              onClick={this.handleClick.bind(this, lib._id)} 
              disabled={!this.props.learncards.props.learnModule}
            >
              <span><Typography component="p">Go to Library "{lib.name}"</Typography></span>
            </Button>
            <ExpansionPanelDetails>
              <List aria-label="words">
                {lib.words.filter(word => word.learnStatus).map(word => (
                  <ListItem>
                    <ListItemText>{word.source.toUpperCase()}: {word.word}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </List>
    );
  }

  reviewList = () =>{
    return (
      <List aria-label="reivew">
        {this.props.learncards.props.libraries.map(lib => (
          <ExpansionPanel className="LibraryPanel">
            <ExpansionPanelSummary><strong>{lib.name}</strong></ExpansionPanelSummary>
            <Button 
              className="Flashcards-button"
              color="primary" 
              onClick={this.handleClick.bind(this, lib._id)} 
              disabled={this.props.learncards.props.learnModule}
            >
              <span><Typography component="p">Go to Library "{lib.name}"</Typography></span>
            </Button>
            <ExpansionPanelDetails>
              <List aria-label="words">
                {lib.words.filter(word => !word.learnStatus).map(word => (
                  <ListItem>
                    <ListItemText>{word.source.toUpperCase()}: {word.word}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </List>
    );
  }

  render() {
    const { learncards, changeLibrary} = this.props;

    const words = learncards.props.library.words;
    const learning = words.filter(word => word.learnStatus).length;
    const review = words.filter(word => !word.learnStatus).length;

    return (
      <div className="Sidebar">
        <List aria-label="learning">
          <ListItemText>
            <span>
              <strong>
                RECORD OF LEANRNING: {review}/{words.length}
              </strong>
            </span>
          </ListItemText>
        </List>

        <ExpansionPanel className="LibraryPanel">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <strong>Learning Library</strong>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>{this.learnList()}</ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel className="LibraryPanel">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <strong>Review Library</strong>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>{this.reviewList()}</ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default LearnSidebar;