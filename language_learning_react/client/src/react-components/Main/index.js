import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import Header from "../Header";
class Mainpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      seconds: 0
    };
    this.props.history.push("/mainpage")
  }
  state = {
    spanishWord: "",
    englishWord: "",
    foldelName: "",
    ratingScore: "",
    learn_new_word: [
      {
        sets: "Default",
        cards: [
          { spanish: "Hola", english: "Hello", score: "0" },
          { spanish: "adiós", english: "goodbye", score: "0" }
        ]
      }
    ]
  };

  render() {
    const {app} = this.props
    return (
      <div id="mybody">
        <Header app={app}/>
        <div id="middle">
          <div className="boxes">
            <div className="innerbox">
              <div className="textbox">
                <img className="bookimg" alt="book" src={require("./static/book.png")} />
              </div>
              <div className="buttonbox">
                <h3>Process of acquiring new language</h3>
                <Link variant="body2" to={"/learning"}>
                    <span className="haha">Learning</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="boxes">
            <div className="innerbox">
              <div className="textbox">
                <img className="bookimg" alt="computer" src={require("./static/comp.png")} />
              </div>

              <div className="buttonbox">
                <h3>Evaluation of past learning material</h3>
                <Link variant="body2" to={"/review"}>
                    <span className="haha">Review</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/*<div className="footer">
          <div>
            <h2 id="footerText">Word learned today: 0</h2>
          </div> 
        </div> */}
      </div>
    );
  }
}
export default Mainpage;
