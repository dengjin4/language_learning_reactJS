import React from "react";
import LearnCard from "./learnCard";
import LearnSidebar from "./learnSidebar";
import Button from "@material-ui/core/Button";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import "./styles.css";
import { getLibrary } from "../../actions/study";

class LearnCards extends React.Component {
  constructor(props) {
    super(props);

    //show cards based on different learn status for learning module/review module respectively
    let myflashcards;
    if(this.props.learnModule){
      myflashcards = this.props.library.words.filter(word => word.learnStatus);
    }else{
      myflashcards = this.props.library.words.filter(word => !word.learnStatus);
    }

    //every time shows the first card in the current library
    this.state = {
      flashcards: myflashcards,
      selectedCardId: myflashcards.length !== 0 ? myflashcards[0]._id : 0,
      index: 0
    };

    this.nextClick = this.nextClick.bind(this);
    this.prevClick = this.prevClick.bind(this);
  }

  //go to the next card with updating the current card id and index
  nextClick() {
    this.setState(prevState => {
      const idx = Math.min(
        prevState.index + 1,
        prevState.flashcards.length - 1
      );
      return {
        selectedCardId: prevState.flashcards[idx]._id,
        index: idx
      };
    });
  }

  //go to the previous card with updating the current card id and index
  prevClick() {
    this.setState(prevState => {
      const idx = Math.max(0, prevState.index - 1);
      return {
        selectedCardId:prevState.flashcards[idx]._id,
        index: idx
      };
    });
  }

  emptyMessage = () =>{
    if(this.props.learnModule){
      return(
        <div id="learnMessage">
          Congratulations! No more learning card in "{this.props.library.name}" Library!
        </div>
      );
    } else{
      return(
        <div id="reviewMessage">
          No more reivew card in "{this.props.library.name}" Library. Please move to Learning Module!
        </div>
      );
    }
  }

  prevButton =() =>{
    return(
      <div className="Flashcards-prevNext-button">
        <Button
          disabled={this.state.index === 0}
          onClick={this.prevClick}
        >
          <ArrowBackIosIcon />
        </Button>
      </div>
    );
  }

  nextButton = () => {
    return (
      <div className="Flashcards-prevNext-button">
        <Button
          disabled={this.state.index === this.state.flashcards.length - 1}
          onClick={this.nextClick}
        >
          <ArrowForwardIosIcon />
        </Button>
      </div>
    );
  }


  render() {
    const {
      libraries, 
      library, 
      moveToLibrary, 
      learnModule, 
      changeLibrary
    } = this.props;
    const card = this.state.flashcards.find(w => w._id === this.state.selectedCardId);
    const currentFlashcard = this.state.flashcards.length !== 0 ? card : '';

    return (
      <div>
        <LearnSidebar
          learncards={this}
          changeLibrary={this.props.changeLibrary}
        />
        {this.state.flashcards.length === 0 ? 
          <div className="Flashcards">{this.emptyMessage()}</div>
         : 
          <div className="Flashcards">
            {this.prevButton()}
            <LearnCard
              learncards={this}
              flashcard={currentFlashcard}
              moveToLibrary={this.props.moveToLibrary}
              selectedCardId={this.state.selectedCardId}
            />
            {this.nextButton()}
          </div>
        }
      </div>
    );
  }
}

export default LearnCards;