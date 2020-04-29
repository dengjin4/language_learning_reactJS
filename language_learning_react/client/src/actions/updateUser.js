export const suspendUser = (userName) => {
    const url = '/suspend/' + userName
    const request = new Request(url, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });

    fetch(request)
    .then(res => {
        // Handle response we get from the API.
        if (res.status === 200) {
            console.log('suspend user');
        } else {
            console.log('Could not toggle ban on user');
        }
    }).catch((error) => {
        console.log(error);
    })
}

export const changePassword = (userName, newPassword) => {
    const url = '/changePassword/' + userName + '/' + newPassword
    
    const request = new Request(url, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    
    fetch(request)
    .then(res => {
        if (res.status === 200) {
            console.log('change password');
        } else {
            console.log('Could not change password on user');
        }
    }).catch((error) => {
        console.log(error);
    })
}