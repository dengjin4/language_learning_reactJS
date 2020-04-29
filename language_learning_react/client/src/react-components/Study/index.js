import React from "react";
import axios from 'axios'
import Header from "../Header";
import LearnSidebar from "./learnSidebar";
import LearnCards from "./learnCards";

import "./styles.css";
import { getLibrary, updateLearnStatus, getDefaultLibraries } from "../../actions/study";

class StudyModule extends React.Component {
  constructor(props) {
    super(props);

    //set library and all libraries for the current user
    this.state = {
      isLoading: true,
      libraries: [],
      library: {}
    };

    this.moveToLibrary = this.moveToLibrary.bind(this);
    this.changeLibrary = this.changeLibrary.bind(this);

    if(this.props.learnModule){
      this.props.history.push("/learning")
    }
    else{
      this.props.history.push("/review")
    }
  }

  //move the selected card to other library when the buttons are clicked
  //updating the learn status for the selected card
  //we need to use the server call to update the library for current user
  moveToLibrary(learncards, selectedCardId) {
    updateLearnStatus(this, learncards, selectedCardId);
    return this.state.library;
  }

  //switch to selected library when the button is clicked
  //updating the current library 
  //we need to use the server call to update the library for current user
  changeLibrary(learncards, libId){
    getLibrary(this, learncards, libId);
    return this.state.library;
  }

  //set the library to default library when access to the study modules
  componentDidMount() {
    getDefaultLibraries(this);
  }


  render() {
    const { app, learnModule } = this.props;
    
    return (
      <div className="Main">
        <Header app={app}/>
        {this.state.isLoading ?
          <p></p>
          : 
          <div className="Main-content">
            <LearnCards
              libraries = {this.state.libraries}
              library={this.state.library}
              moveToLibrary={this.moveToLibrary}
              learnModule={learnModule}
              changeLibrary={this.changeLibrary}
            />
          </div>
        }
      </div>
    );
  }
}

export default StudyModule;