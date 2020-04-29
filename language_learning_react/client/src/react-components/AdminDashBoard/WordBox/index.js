import React from "react";
import "./WordBox.css";
import Button from "@material-ui/core/Button";
import {
  deleteRWord,
  addToDefault,
  deleteDWord,
} from "../../../actions/deleteRWord";
import DeleteIcon from "@material-ui/icons/Delete";
class Wordbox extends React.Component {
  // function to reject word and remove it from the pending list
  rejectWord = (app, obj) => {
    const filterWordList = app.state.wordList.filter((w) => {
      return w !== obj;
    });
    deleteRWord(obj.word);
    app.setState({
      wordList: filterWordList,
    });
  };

  // function to approve word and add to default list
  approveWord = (app, obj) => {
    const filterWordList = app.state.wordList.filter((w) => {
      return w !== obj;
    });
    addToDefault(obj);
    deleteRWord(obj.word);
    app.setState({
      wordList: filterWordList,
    });
    const dList = app.state.defaultList
    dList.push(obj)
    app.setState({
      defaultList: dList,
    });
  };

  // function to delete word from default library
  deleteWord = (app, obj) => {
    const filterWordList = app.state.defaultList.filter((w) => {
      return w !== obj;
    });
    deleteDWord(obj.word);
    app.setState({
      defaultList: filterWordList,
    });
  };

  render() {
    const { pendingList, app, flag } = this.props;
    if (flag) {
      return pendingList.map((obj) => (
        <div className="wordbox">
          <div className="libword">
            <p>
              <strong>{obj.source.toUpperCase()}:</strong> {obj.word}
            </p>
          </div>
          <div className="libword">
            <p>
            </p>
          </div>
          <div className="center">
            <Button
              variant="contained"
              color="primary"
              onClick={this.approveWord.bind(this, app, obj)}
            >
              approve
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.rejectWord.bind(this, app, obj)}
              startIcon={<DeleteIcon />}
            >
              reject
            </Button>
          </div>
          <div className="rightlibword">
            <p>
              <strong>Creator: </strong> {obj.userName}{" "}
            </p>
          </div>
        </div>
      ));
    } else {
      let sortList = pendingList;
      sortList.sort(function (a, b) {
        if (a.word < b.word) {
          return -1;
        }
        if (a.word > b.word) {
          return 1;
        }
        return 0;
      });
      return sortList.map((obj) => (
        <div className="wordbox">
          <div className="libword">
            <p>
              <strong>{obj.source.toUpperCase()}:</strong> {obj.word}
            </p>
          </div>
          <div className="libword">
            <p>
            </p>
          </div>
          <div className="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={this.deleteWord.bind(this, app, obj)}
              startIcon={<DeleteIcon />}
            >
              delete
            </Button>
          </div>
        </div>
      ));
    }
  }
}

export default Wordbox;
