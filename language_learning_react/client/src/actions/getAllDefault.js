export const getAllDefault = (adminDashBoard) => {
    // the URL for the request
    const url = "/defaultLibrary";

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
            adminDashBoard.setState({ defaultList: json });
        })
        .catch(error => {
            console.log(error);
        });
};
