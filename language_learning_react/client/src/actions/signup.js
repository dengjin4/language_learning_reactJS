const log = console.log;
const axios = require("axios");
// Change the state for this page
export const handleInputChange = (event, page) => {
  const target = event.target;
  const value = target.value;
  const name = target.name;
  page.setState({
    [name]: value
  });
};
//Sign up a new user
export const submitForm = (event, page) => {
  if (
    page.state.password === page.state.rePassword &&
    page.state.password.length !== 0 &&
    page.state.username.length !== 0
  ) {
    let userType = "ord";
    if (page.state.username === "admin") {
      userType = "admin";
    }
    event.preventDefault();
    const newUser = {
      name: page.state.username,
      password: page.state.password,
      type: userType,
      suspend: false
    };

    const url = "/addUser";
    axios
      .post(url, newUser)
      .then(res => {
        if (res.status == 200) {
          page.props.history.push("/");
          alert("Your sign up was successful");
        } else {
          alert("Username have already been used, please try another username");
        }
      })
      .catch(error => {
        alert("Username have already been used, please try another username");
      });
  } else if (page.state.password !== page.state.rePassword) {
    event.preventDefault();
    page.setState({ error: 1, username: "", password: "", rePassword: "" });
  }
};
