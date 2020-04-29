const axios = require("axios");
//Read the cookie and set the state for app
export const readCookie = app => {
  const url = "/users/check-session";

  axios
    .get(url)
    .then(res => {
      if (res.status === 200) {
        if (res.data && res.data.user && res.data.type) {
          app.setState({ user: res.data.user, type: res.data.type, image:res.data.image});
        }
        else{
            app.setState({ user: null, type: null });
        }
      }
      //finish loading
      app.setState({ loading: false });
    })
    .catch(error => {
      console.log(error);
      app.setState({ loading: false });
    });
};
// handle logout
export const logout = (app,page) => {
  const url = "/users/logout";

  axios
    .get(url)
    .then(res => {
      console.log("logout");
    })
    .catch(error => {
      console.log(error);
    }).finally(()=>{
      app.setState({
        user: null,
        type: null,
        loading: false
      });
      page.props.history.push({ pathname: "/"});
    });
};
