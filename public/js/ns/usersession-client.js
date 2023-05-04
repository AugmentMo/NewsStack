var usersessiondata = {loggedin: false};

function updateUserSessionData(data) {
    usersessiondata.loggedin = data.loggedin;

    if (isLoggedIn()) {
        // Logged in
        // hide login
        $('#loginbtn').hide();

        // show profile dropdown + logout
        $('#profiledropdown').show();

        // link socketid
        socket.emit("linksid", {sid: data.sid});
    }
    else {
        // Logged out
        // hide profile dropdown + logout
        $('#profiledropdown').hide();
        
        // show login
        $('#loginbtn').show();
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

