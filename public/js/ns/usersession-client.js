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
    
    // If logged in, once request newsstack data
    if (isLoggedIn()) {
      socket.emit("getnsdata")
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });


// save ns data to user db
function saveNSData() {
  
}

// load ns data from user db
socket.on('nsdata', (data) => {
    // handle incoming newsstack data
  newsfeeds = data;

  // on receiving the ns data from server, request all feeds
  requestNewsFeeds();
});