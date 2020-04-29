// A function to send a GET request to the web server,
// and then loop through them and add a list element for each student
export const getAllUsers = (adminDashBoard) => {
    // the URL for the request
    const url = "/users";

    // Since this is a GET request, simply call fetch on the URL
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            } else {
                alert("Could not get users");
            }
        })
        .then(json => {
            // the resolved promise with the JSON body
            adminDashBoard.setState({ userList: json });
        })
        .catch(error => {
            console.log(error);
        });
};



export const getAllRecommend = (adminDashBoard) => {
    // the URL for the request
    const url = "/recommend";

    // Since this is a GET request, simply call fetch on the URL
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            } else {
                alert("Could not get recommend word");
            }
        })
        .then(json => {
            // the resolved promise with the JSON body
            adminDashBoard.setState({ wordList: json });
        })
        .catch(error => {
            console.log(error);
        });
};