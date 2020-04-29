const axios = require("axios");

// Signin this user and set state
export const handleSignIn = (e, name, password, page, app) => {
  if (!name || !password) {
    return;
  }
  e.preventDefault();
  const url = "/users/login";
  axios
    .post(url, {
      name: name,
      password: password
    })
    .then(res => {
      if (res.status === 200) {
        app.setState({ user: res.data.user, type: res.data.type, image: res.data.image });
        if (res.data.type === "ord") {
          page.props.history.push("/mainpage");
        } else if (res.data.type === "admin") {
          page.props.history.push("/admin");
        }
      } else {
        page.setState({ error: 1, username: "", password: "" });
      }
    })
    .catch(error => {
      page.setState({ error: 1, username: "", password: "" });
    });


    axios.patch(url,{
      name: name,
      password: password
    }).then(res => {
      if(res.status === 200){
        console.log("login status change")
      }
      else {
        console.log("Couldn't login")
    }
    }).catch(error => {
      console.log(error)
    })
};

//handle input change
export const handleInputChange = (event, page) => {
  const target = event.target;
  const value = target.value;
  const name = target.name;
  page.setState({
    [name]: value
  });
};
