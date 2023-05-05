var usersessiondata = {loggedin: false};
var userdata = {};

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
    updateUserSessionData(usersessiondata);

    // If server requests, send ns data, usually on user creation
    if (usersessiondata.req_ns_data) {
      saveNSData();
    }
    else {
      // If logged in, once request newsstack data
      if (isLoggedIn()) {
        setTimeout(() => {
          socket.emit("getnsdata");
          socket.emit("getuserdata");
        }, 500);
      }
    }

  })
  .catch(error => {
    console.error('Error:', error);
  });


// save ns data to user db
function saveNSData() {
  // create a copy of newsfeed data
  var savensdata = Object.assign({}, newsfeeds);

  // clear all feed items
  for (const feedid in savensdata) {
    savensdata[feedid]["feeditems"] = [];
  }

  // send data to server
  socket.emit("updatensdata", savensdata);
}

// load ns data from user db
socket.on('nsdata', (data) => {
    // handle incoming newsstack data
  newsfeeds = data;

  // on receiving the ns data from server, request all feeds
  requestNewsFeeds();
});

// load user data
socket.on('userdata', (data) => {
  userdata = data;
  $("#userDropdown > img").attr("src", userdata.userpicture)
  $('#userprofilename').text(userdata.username); 
  $('#userprofileemail').text(userdata.useremail);
});