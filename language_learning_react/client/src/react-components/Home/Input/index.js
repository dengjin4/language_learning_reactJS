import React from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

import "./styles.css";

/* Component for the Input field, a wrapper around MUI TextField */
class Input extends React.Component {
  render() {
    const { label, value, onChange, name, type, InputProps } = this.props;

    return (
      <Grid item>
        <TextField
          className="input"
          variant="outlined"
          fullwidth
          required
          name={name}
          label={label}
          value={value}
          defaultValue={value || ""}
          margin="normal"
          type={type}
          onChange={onChange}
          InputProps={InputProps}
        />
      </Grid>
    );
  }
}

export default Input;
