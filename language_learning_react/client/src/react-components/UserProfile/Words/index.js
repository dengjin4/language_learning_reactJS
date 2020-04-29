import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import { deleteWord,moveWord } from "../../../actions/profile";

class Words extends React.Component {
  render() {
    const { word, libId, moduleName, moduleComponent, panelComponent ,profileComponent} = this.props;

    return (
      <TableRow className="word" key={word.term}>
        <TableCell align="center" component="th" scope="row">
          <Typography variant="h6">{word.source.toUpperCase()}: </Typography>
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          <Typography variant="h6">{word.word}</Typography>
        </TableCell>

        <TableCell align="right" component="th" scope="row">
          <Button
            variant="contained"
            color="primary"
            startIcon={<SwapHorizIcon />}
            // server call to change word status(learning/review)
            onClick={() =>moveWord(moduleComponent,libId, word,panelComponent,profileComponent)}
          >
            {moduleName}
          </Button>
        </TableCell>

        <TableCell align="right" component="th" scope="row">
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
            // server call to delete word
            onClick={() =>deleteWord(moduleComponent,libId, word,panelComponent,profileComponent)}
          >
            Delete
          </Button>
        </TableCell>
      </TableRow>
    );
  }
}
export default Words;
