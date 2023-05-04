var usersessiondata = {loggedin: false};

function updateUserSessionData(data) {
    usersessiondata.loggedin = data.loggedin;

    if (isLoggedIn()) {
        // Logged in
        // hide login
        // show profile dropdown + logout

        // link socketid
        socket.emit("linksid", {sid: data.sid});
    }
    else {
        // Logged out
        // hide profile dropdown + logout
        // show login
    }
}

function isLoggedIn() {
    return usersessiondata.loggedin;
}

fetch('/usersession')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return response.json();
  })
  .then(usersessiondata => {
      updateUserSessionData(usersessiondata)
  })
  .catch(error => {
    console.error('Error:', error);
  });

