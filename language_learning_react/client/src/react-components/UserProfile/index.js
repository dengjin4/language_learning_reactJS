import React from "react";
import Typography from "@material-ui/core/Typography";
import "./styles.css";
import Header from "./../Header";
import UserPanel from "./Userpanel";
import {getAllLib} from "../../actions/recommend"

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    // libraries store the current all libraries information
    this.state = {
      libraries:[],
    }
    this.props.history.push("/profile")

  }

  componentDidMount(){
    // use server call to get this user's all libaraies data and 
    // set libraries to those data 
    getAllLib(this)        
  }
  

  render() {
    // get app from app.js
    const {app} = this.props
    
    //  filter all words with learning status == True(need to learn)
    const learning = this.state.libraries.filter(l => l.words.some(w => w.learnStatus)).map(element => {
      return Object.assign({}, element, {words : element.words.filter(w => w.learnStatus)});
    }); 
    // count the number of words that need to learn
    const totalLearnNum = learning.reduce((total, library) => total + library.words.length, 0);
    
    //  filter all words with learning status == False(need to review)
    const review = this.state.libraries.filter(l => l.words.some(w => !w.learnStatus)).map(element => {
      return Object.assign({}, element, {words : element.words.filter(w => !w.learnStatus)});
    });
    // count the number of words that need to review
    const totalReviewNum = review.reduce((total, library) => total + library.words.length, 0);
    // count the total number of words
    const totalNum = this.state.libraries.reduce((total, library) => total + library.words.length, 0)

    return (
      <div className="Profile">
        <Header app={app}/>
        <div className="navigate">
          {/* showing the user name and user image */}
          <div className = "headerContainer">
              <div className="profileInfo">
                <img
                  className="useravatar"
                  alt="user imag"
                  src = {app.state.image}
                />
                <div className="username">
                  <Typography variant="h4" className="text">{app.state.user}</Typography>
                </div>
              </div>
              {/* showing the number of total words */}
              <div className="wordInfo">
                  <div className="wordPart">
                    <Typography variant="h4" className="number">
                      {totalNum}
                    </Typography>
                    <Typography variant="b1" className="smallWord">
                      total words
                    </Typography>
                  </div>
                  {/* the number of words to learn*/}
                  <div className="wordPart">
                    <Typography variant="h4" className="number">
                      {totalLearnNum}
                    </Typography>
                    <Typography variant="b1" className="smallWord">
                      need to learn
                    </Typography>
                  </div>
                  {/* the number of words to review*/}
                  <div className="wordPart">
                    <Typography variant="h4" className="number">
                      {totalReviewNum}
                    </Typography>
                    <Typography variant="b1" className="smallWord">
                      need to review
                    </Typography>
                  </div>
              </div>
          </div>

          <div className="profileInner">
            {/* pass the state properties to UserPanel component, and also pass 'this' and app for future bind */}
            <UserPanel
              libraries={this.state.libraries}
              profileComponent={this}
              appComponent={app}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfile;