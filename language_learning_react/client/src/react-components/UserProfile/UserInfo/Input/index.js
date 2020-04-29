import React from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

import "./styles.css";

/* Component for the Input field, a wrapper around MUI TextField */
class UserInput extends React.Component {
  render() {
    const { label, value, onChange, name } = this.props;

    return (
      <Grid item>
        <TextField
          className="user_input"
          variant="outlined"
          fullwidth
          required
          name={name}
          label={label}
          value={value}
          defaultValue={value || ""}
          margin="normal"
          onChange={onChange}
        />
      </Grid>
    );
  }
}

export default UserInput;
