const fetch = require('node-fetch');
const { collectNews } = require('./fetchutil');
const { createUserSession, updateUserSessionSocketID, removeUserSession, getUserSessionSID, isUserSessionExisting, getUserSubID } = require('./usersession-server.js')
const { updateUserData, updateNewsStacks, updateLastLogin, getNewsStacks} = require('./mongodbapi.js')
const express = require('express');
const app = express();
const https = require('https');
const http = require('http');
const fs = require('fs');

const httpsoptions = {
    /* DEV
    key: fs.readFileSync('/app/sslcerts/privkey.pem'),
    cert: fs.readFileSync('/app/sslcerts/fullchain.pem')
    */
};

/* DEV
const httpsServer = https.createServer(httpsoptions, app);
*/
const httpsServer = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(httpsServer);
require('dotenv').config();

// Auth0
const { auth, requiresAuth } = require('express-openid-connect');
const auth0_config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_CLIENT_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_DOMAIN
  };
app.use(auth(auth0_config));

// Clean up string
function cleanUpString(string) {
    // remove anything but dom
    const cleandom = DOMPurify.sanitize(string);
    // remove dom
    const cleanstring = cleandom.replace(/(<([^>]+)>)/ig, '');
    // limit length
    const limitedstring = cleanstring.substring(0, 50);

    return limitedstring;    
}

function cleanUpNewsFeedReq(newsfeed) {
    const clean_feedid = cleanUpString(newsfeed["feedid"])
    const clean_feedkeywordstr = cleanUpString(newsfeed["feedkeywordstr"])

    return {"feedid": clean_feedid ,"feedkeywordstr": clean_feedkeywordstr}
}

io.on("connection", (socket) => {
    console.log("socket connected")

    // News requests
    socket.on("getnews", (newsfeed) => {
        console.log("news request")
        const cleannewsfeed = cleanUpNewsFeedReq(newsfeed);
        collectNews(socket, cleannewsfeed)
    });

    // Link socketid with sid
    socket.on("linksid", (data) => {
        updateUserSessionSocketID(data.sid, socket.id);
    });

    // Remove usersession on disconnect
    socket.on("disconnect", () => {
        console.log("Socket disconnected.");

        const sid = getUserSessionSID(socket.id)
        removeUserSession(sid);

        console.log("Removed usersession.");
    });
    
    // Newsstacks data get request
    socket.on("getnsdata", () => {
        const sid = getUserSessionSID(socket.id);
        
        if (sid != null) {
            const sub = getUserSubID(sid);
            const ns_data = getNewsStacks(sub);
            socket.emit("nsdata", ns_data);
        } else {
            console.log("Error: user session not found")
            socket.emit("errormsg", "Error: user session not found");
        }
    });

    // Newsstacks data update request
    socket.on("updatensdata", (data) => {
        const sid = getUserSessionSID(socket.id);
        
        if (sid != null) {
            const sub = getUserSubID(sid);
            const ns_data = updateNewsStacks(sub, data);
        } else {
            console.log("Error: user session not found")
            socket.emit("errormsg", "Error: user session not found");
        }
    });
});

// Serve static files from the "public" directory
app.use(express.static('public'));

// Define a route for the home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/logoutusersession', (req, res) => {
    console.log("Logging out.");

    console.log(req.oidc.user.sid, " says good bye")
    removeUserSession(req.oidc.user.sid);
    
    console.log("Removed usersession.");
    res.redirect('/logout');
});

app.get('/usersession', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        const sid = req.oidc.user.sid;
        const sub = req.oidc.user.sub;

        createUserSession(sid, sub);
        updateUserData(sub, req.oidc.user);
        updateLastLogin(sub);

        res.send({loggedin: true, sid: sid});
    }
    else {
        res.send({loggedin: false, sid: ""});
    }
});

// Start the server
httpsServer.listen(8080, () => {
    console.log('HTTPS server started on port 443');
});
  
// Redirect HTTP to HTTPS
const httpServer = express();
httpServer.get('*', (req, res) => {
    // res.redirect('https://' + req.headers.host + req.url);
});
httpServer.listen(9999, () => {
    console.log('HTTP server started on port 80');
});
