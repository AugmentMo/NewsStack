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
      socket.emit("linksid", { sid: data.sid });
      
      usersessiondata.sid = data.sid;
      settid(usersessiondata.sid);
    }
    else {
        // Logged out
        // hide profile dropdown + logout
        $('#profiledropdown').hide();
        
        // show login
      $('#loginbtn').show();
      
      if (!usersessiondata.sid) {
        settid('unknown-'+generateRandomString(20));
      }
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

    if (!isLoggedIn()) { // The user is not logged in
      useLocalStorageSession();
    }

  })
  .catch(error => {
    console.error('Error:', error);
  });

function updateBookmarksAndArchive(stacks) {
  var result = []
  for (const feedid in stacks) {
    var newstack = stacks[feedid];

    if (!("bookmarks" in newstack)) {
      newstack["bookmarks"] = [];
    }
    if (!("archive" in newstack)) {
      newstack["archive"] = [];
    }

    result.push(newstack);
  }

  return result;
}

// save ns data to user db
function saveNSData() {
  // create a copy of newsfeed data
  var savensdata = JSON.parse(JSON.stringify(newsfeeds));

  // clear all feed items
  for (const feedid in savensdata) {
    savensdata[feedid]["feeditems"] = [];
  }

  savensdata = updateBookmarksAndArchive(savensdata)

  // send data to server
  socket.emit("updatensdata", savensdata);
}

// load ns data from user db
socket.on('nsdata', (data) => {
  // handle incoming newsstack data
  newsfeeds = updateBookmarksAndArchive(data);
  
  // on receiving the ns data from server, request all feeds
  updateNewsFeedContainers();
  requestNewsFeeds();
});

// load user data
socket.on('userdata', (data) => {
  userdata = data;
  $("#userDropdown > img").attr("src", userdata.userpicture)
  $('#userprofilename').text(userdata.username); 
  $('#userprofileemail').text(userdata.useremail);
});

// load user data
socket.on('mixpanel_token', (data) => {
  if (data != undefined) {
    initMixpanel(data);
  }
});