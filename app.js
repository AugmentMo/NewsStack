const fetch = require('node-fetch');
const { collectNews } = require('./fetchutil');
const { createUserSession, updateUserSessionSocketID, removeUserSession, getUserSessionSID, isUserSessionExisting, getUserSubID } = require('./usersession-server.js')
const { updateUserData, updateNewsStacks, updateLastLogin, getNewsStacks, isUserExisting, createUser, getUserData } = require('./mongodbapi.js')
const express = require('express');
const app = express();
const https = require('https');
const http = require('http');
const fs = require('fs');
var Mixpanel = require('mixpanel');
var mixpanel = Mixpanel.init('50c39f0643d7aedd6aec85435b9a48d9');

const httpsoptions = {
    key: fs.readFileSync('/app/sslcerts/privkey.pem'),
    cert: fs.readFileSync('/app/sslcerts/fullchain.pem')
};

const httpsServer = https.createServer(httpsoptions, app);
const { Server } = require("socket.io");
const io = new Server(httpsServer);
require('dotenv').config();

// Auth0
const { auth, requiresAuth } = require('express-openid-connect');
const e = require('express');
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

const MAX_NSDATA_SIZE = 10240; // Maximum storage data
function isNsDataValidated(ns_data) {
    const ns_data_string = JSON.stringify(ns_data);
    const ns_data_size = Buffer.byteLength(ns_data_string, 'utf8');

    if (ns_data_size > MAX_NSDATA_SIZE) {
        return false;
    }

    return true;
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

        const sid = getUserSessionSID(socket.id);
        if (sid){
            removeUserSession(sid);
        }
        mixpanel.track('Disconnect', {'distinct_id': (sid ? sid : "unknwn")});
    });
    
    // Newsstacks data get request
    socket.on("getnsdata", async () => {
        const sid = getUserSessionSID(socket.id);
        
        if (sid != null) {
            const sub = getUserSubID(sid);
            const ns_data = await getNewsStacks(sub);
            socket.emit("nsdata", ns_data);
        } else {
            console.log("Error: user session not found")
            socket.emit("errormsg", "Error: user session not found");
        }
    });

    // Newsstacks data update request
    socket.on("updatensdata", async (data) => {
        const sid = getUserSessionSID(socket.id);

        if (sid != null) {
            if (isNsDataValidated(data)){
                const sub = getUserSubID(sid);
                await updateNewsStacks(sub, data);
            }
            else {
                console.log("Error: ns data invalid")
                socket.emit("errormsg", "Error: invalid ns data");
            }
        } else {
            console.log("Error: user session not found")
            socket.emit("errormsg", "Error: user session not found");
        }
    });

    // Userdata request
    socket.on("getuserdata", async (data) => {
        const sid = getUserSessionSID(socket.id);

        if (sid != null) {
            const sub = getUserSubID(sid);
            const userdata = await getUserData(sub);
            socket.emit("userdata", {username: userdata.name, useremail: userdata.email, userpicture: userdata.picture});
        } else {
            console.log("Error: user session not found")
            socket.emit("errormsg", "Error: user session not found");
        }
    });

    // User feedback
    socket.on("sendfeedback", async (data) => {
        let feedbackdata = data;
        
        if (isNsDataValidated(feedbackdata)){
            feedbackdata['distinct_id'] = (req.oidc.user.sid ? req.oidc.user.sid : "unknwn");
            mixpanel.track('feedback', feedbackdata);
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
    console.log("User logging out.");

    removeUserSession(req.oidc.user.sid);
    mixpanel.track('Logout', { 'distinct_id': (req.oidc.user.sid ? req.oidc.user.sid : "unknwn") });
    
    res.redirect('/logout');
});

app.get('/usersession', async (req, res) => {
    if (req.oidc.isAuthenticated()) {
        const sid = req.oidc.user.sid;
        const sub = req.oidc.user.sub;

        createUserSession(sid, sub);

        // if first time logging in, request ns data
        const userexists = await isUserExisting(sub);
        if (!userexists) {
            // Create new user and ask client for ns data
            createUser(sub, req.oidc.user).then(() => {
                res.send({ loggedin: true, sid: sid, req_ns_data : true });
            });

            mixpanel.track('User Created', {'distinct_id': sid});
        }
        else {
            updateUserData(sub, req.oidc.user).then(() => {
                updateLastLogin(sub);
            }).finally(() => {
                res.send({ loggedin: true, sid: sid, req_ns_data : false });
            })
            mixpanel.track('Visit', { 'distinct_id': sid});
            mixpanel.track('Login', {'distinct_id': sid});
        }

    }
    else {
        res.send({ loggedin: false, sid: "", req_ns_data: false });
        mixpanel.track('Visit', { 'distinct_id': "unknwn"});
    }
});

// Start the server
httpsServer.listen(443, () => {
    console.log('HTTPS server started on port 443');
});
  
// Redirect HTTP to HTTPS
const httpServer = express();
httpServer.get('*', (req, res) => {
    res.redirect('https://' + req.headers.host + req.url);
});
httpServer.listen(80, () => {
    console.log('HTTP server started on port 80');
});
