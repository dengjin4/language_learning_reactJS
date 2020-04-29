import {getAllLib} from "./recommend.js"
const axios = require("axios");

// A function to update the username form state
export const updateUerForm = (formComp, field) => {
    const value = field.value;
    const name = field.name;

    formComp.setState({
        [name]: value
    });
};

// A function to send a Patch request when editing user name
export const saveUser = (curState,nameState) => {
    const user = curState.state
    const url = "/users/changeName";
    if (user.name.trim() == "") {
        curState.setState(
            {
                message: {
                    body: "Error: Username cannot be empty.",
                    type: "error"
                }
            }
        )
    } else {
        axios
            .patch(url, user)
                .then(res => {
                console.log(res);
                if (res.status === 200) {
                    console.log("name edited:", res.data);
                    nameState.setState({user:res.data.user})
                    curState.setState(
                        {
                            nameEdit: false, 
                            message: {
                                body: "Success: Edited user name.",
                                type: "success"
                        }
                    })
                    console.log("name state: ", nameState.state.user )
                } else {
                    curState.setState(
                        {
                            message: {
                                body: "Error: Could not edit user name.",
                                type: "error"
                        }
                    })
                }
                })
                .catch(error => {
                    console.log(error);
                });
    }
};

// A function to send a PATCH request to change user password
export const changePass = (curState) => {
    const user = curState.state
    const url ="/users/changePass";
    if (user.password.trim() == "") {
        curState.setState(
            {
                message: {
                    body: "Error: Password cannot be empty.",
                    type: "error"
                }
            }
        )
    }else {
        axios
            .patch(url, user)
                .then(res => {
                console.log(res);
                if (res.status === 200) {
                    console.log("password edited:");
                    curState.setState(
                        {
                            passEdit: false, 
                            message: {
                                body: "Success: Edited user password.",
                                type: "success"
                        }
                    })
                } else {
                    curState.setState(
                        {
                            message: {
                                body: "Error: Could not edit user password.",
                                type: "error"
                        }
                    })
                }
                })
                .catch(error => {
                    console.log(error);
                });
    }
}



// A function to send a POST request to upload profile image
export const addImage = (form, curState, userState) =>{
    const url = '/images';
    // The data we are going to send in our request
    const imageData = new FormData(form);
    axios
        .post(url,imageData)
        .then(res => {
            console.log("addImage res status", res.status)
            if (res.status === 200) {
                // set state from app.js
                userState.setState({image:res.data.image_url})
                curState.setState(
                    {
                        message: {
                            body: "Success: Changed profile image.",
                            type: "success"
                    }
                })
            }else {
                curState.setState(
                    {
                        message: {
                            body: "Error: Could not change profile image.",
                            type: "error"
                    }
                })
            }
        })
}



// A function to send a GET request to get a choosen library 
export const getLearnLib = (curState, lib_id,index) => {
    // the URL for the request
    const url =  "/libraries/".concat(lib_id);
    axios
        .get(url)
            .then(res => {
                if (res.status === 200) {
                    curState.setState(
                        { 
                            Words: res.data.words.filter(w => w.learnStatus),
                            libId: lib_id,
                            selectedIndex: index
                        });
                } else {
                    alert("Could not get libraries");
                }
            })
            .catch(error => {
                console.log(error);
            });
};

// A function to send a GET request to get a choosen library 
export const getReviewLib = (curState, lib_id,index) => {
    // the URL for the request
    const url =  "/libraries/".concat(lib_id);
    axios
        .get(url)
            .then(res => {
                if (res.status === 200) {
                    
                    curState.setState(
                        { 
                            Words: res.data.words.filter(w => !w.learnStatus),
                            libId: lib_id,
                            selectedIndex: index
                        });
                } else {
                    alert("Could not get libraries");
                }
            })
            .catch(error => {
                console.log(error);
            });
};

// A function to send a DELETE request to delete a library
export const deleteLib = (lib_id,profileApp) => {
    const url = "/libraries/".concat(lib_id);
    axios
        .delete(url)
            .then(res => {
                if (res.status === 200) {
                    // update libraries state
                    getAllLib(profileApp)
                }else {
                    alert("Could not delete library");
                }
            })
            .catch(error => {
                console.log(error);
            })
}

// A function to send a DELETE request to delete a word
export const deleteWord = (curState,lib_id, word,app,profileApp) => {
    // the URL for the request
    const url = "/libraries/".concat(lib_id).concat('/').concat(word._id);
    axios
        .delete(url)
            .then(res => {
                if (res.status === 200) {
                    // under learning module 
                    if (app.state.value === 1 ) {
                        curState.setState({ Words: res.data.library.words.filter(w => w.learnStatus),
                            libId: lib_id});
                    }
                    // under reveiw module
                    if(app.state.value === 2){
                        console.log(app.state.value)
                        curState.setState({ Words: res.data.library.words.filter(w => !w.learnStatus),
                            libId: lib_id});
                    }
                    // update libraries state
                    getAllLib(profileApp)
                } else {
                    alert("Could not delete word");
                }
            })
            .catch(error => {
                console.log(error);
            });
};

// A function to send a PATCH request to change word learn status
export const moveWord = (curState,lib_id, word,app,profileApp) => {

  const url = "/libraries/".concat(lib_id).concat('/').concat(word._id);
  axios
    .patch(url, word)
        .then(res => {
        console.log(res);
        if (res.status === 200) {
            console.log("word moved:", res)
            // under learning module 
            if (app.state.value === 1 ) {
                console.log("current value",app.state.value)
                curState.setState({ Words: res.data.library.words.filter(w => w.learnStatus),
                    libId: lib_id});
            }
            // under reveiw module
            if(app.state.value === 2){
                console.log(app.state.value)
                curState.setState({ Words: res.data.library.words.filter(w => !w.learnStatus),
                    libId: lib_id});
            }}
            // update libraries state
            getAllLib(profileApp)
        })
        .catch(error => {
            console.log(error);
        });
};

