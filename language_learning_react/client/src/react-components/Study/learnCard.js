import React from "react";
// import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import "./styles.css";

class LearnCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      flipped: false,
      selectedCardId: this.props.selectedCardId,
      remember:false,
      learn:false
    };

    this.rememberClick = this.rememberClick.bind(this);
    this.learnClick = this.learnClick.bind(this);
    this.flipClick = this.flipClick.bind(this);
  }


  //"flip" button to flip the card to see the word and translations in different sides
  flipClick(){
    this.setState({flipped: !this.state.flipped});
  }

  //"remember" button for learning module
  // the selected card will be added to review module and removed from learning module
  //update word's learn status in current library for current user using server call
  rememberClick() {
    this.setState({remember:true});
    this.props.moveToLibrary(this.props.learncards,  this.props.selectedCardId);
  }


  //"learn again" button for review module
  // the selected card will be added to learning module and removed from review module
  //update word's learn status in current library for current user using server call
  learnClick (){
    this.setState({learn:true});
    this.props.moveToLibrary(this.props.learncards, this.props.selectedCardId);
  }


  //for each new card, set buttons to default value
  componentDidUpdate(prevProps) {
    const currentCardId = this.props.flashcard._id;
    const prevCardId = prevProps.flashcard._id;

    if (currentCardId !== prevCardId) {
      this.setState({ 
        remember:false, 
        learn:false,
        flipped:false
      })
    }
  }

  flipButton = () =>{
    return (
      <div className="Flashcards-flip-button">
        <Button
          variant="contained"
          color="primary"
          onClick={this.flipClick}
        >
          <span>
            <strong>FLIP TO LEARN</strong>
          </span>
        </Button>
      </div>
    )
  };


  RememberLearnButton =() => {
    if (this.props.learncards.props.learnModule) {
      return (
        <div className="Flashcards-button">
          <Button
            variant="contained"
            color="primary"
            onClick={this.rememberClick}
          >
            <span>
              <strong>REMEMBER</strong>
            </span>
          </Button>
        </div>
      );
    } else{
      return (
        <div className="Flashcards-button">
          <Button
            variant="contained"
            color="primary"
            onClick={this.learnClick}
          >
            <span>
              <strong>LEARN AGAIN</strong>
            </span>
          </Button>
        </div>
      );
    }
  }

  translation = () =>{
    return (
      this.props.flashcard.translation.map(x => (
        <List component="nav" aria-label="main mailbox folders">
        {x ? 
          <div>
            <ListItem>
              <Typography id="pos-word">{x.fl}</Typography>
            </ListItem>
            {x.def.map(d => (
              <ListItem>
                <Typography id="learn-describe" component="p">
                  {d}
                </Typography>
              </ListItem>
            ))}
          </div>
        :
        <div></div>
        }
      </List>
      ))
    );
  }

  render() {
    const {
      learncards, 
      flashcard,
      moveToLibrary,
      selectedCardId,
    } = this.props;

    return (
      <div className="Flashcard-Row">
        {this.flipButton()}
        <Card id="learnCard" variant="outlined">
          <CardContent>
            {!this.state.flipped ?
              <div id="learn-word" component="h1">
                <Typography id="pos-word">
                  {flashcard.source.toUpperCase()}: {flashcard.word}
                </Typography>
              </div>
              :
              <div id="learn-translation">
                <Typography id="learn-desTitle" component="h2">
                  Definition of {flashcard.word}
                </Typography>
                {this.translation()}
              </div>
            }
            {this.RememberLearnButton()}
          </CardContent>
        </Card>
      </div>
    );
  }
}
export default LearnCard;