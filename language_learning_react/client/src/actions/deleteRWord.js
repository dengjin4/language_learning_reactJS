export const deleteRWord = (word) => {
    const url = "/delete/recommend/" + word


    const request = new Request(url, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });

    fetch(request)
        .then(res => {
            if (res.status === 200) {
                console.log("Delete recommended word")
            } else {
                console.log("Couldn't delete recommended word")
            }
        })
        .catch(error => {
            console.log(error);
        });
};

export const addToDefault = (word) => {
    const url = '/addWord/defaultLib'
    const request = new Request(url, {
        method: 'post',
        body: JSON.stringify(word),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
        .then(res => {
            if (res.status === 200) {
                console.log("Word add to default")
            } else {
                console.log("Couldn't add word to default")
            }
        })
        .catch(error => {
            console.log(error);
        });
}

export const deleteDWord = (word) => {
    const url = "/delete/default/" + word

    const request = new Request(url, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });

    fetch(request)
        .then(res => {
            if (res.status === 200) {
                console.log("Delete word in default library")
            } else {
                console.log("Couldn't delete word in default library")
            }
        })
        .catch(error => {
            console.log(error);
        });
};