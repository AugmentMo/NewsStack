const fetch = require('node-fetch');
const { DOMParser } = require('xmldom');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const DOMPurify = require('isomorphic-dompurify');
const { getMetaFeedData, fetchAndCropImage } = require('./fetchutil');

const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');

const httpsoptions = {
    key: fs.readFileSync('/app/sslcerts/privkey.pem'),
    cert: fs.readFileSync('/app/sslcerts/fullchain.pem')
    };

const server = https.createServer(httpsoptions, app);
const { Server } = require("socket.io");
const io = new Server(server);


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
    socket.on("getnews", (newsfeed) => {
        console.log("news request")
        const cleannewsfeed = cleanUpNewsFeedReq(newsfeed);
        collectNews(socket, cleannewsfeed)
    });
});
  

function collectNews(socket, newsfeed) {
    const url = 'https://news.google.com/rss/search?q='+newsfeed["feedkeywordstr"]+'&hl=en-NZ&gl=NZ&ceid=NZ:en';
    fetch(url)
      .then(response => response.text())
      .then(async data => {
          const parser = new DOMParser();
          let relinkdata = data.replace(/<link>/g, "<relink>").replace(/<\/link>/g, "</relink>"); // this is ugly but dompurify sanitieser removes </link> as we are dealing with XML

          const cleanData = DOMPurify.sanitize(relinkdata, {
              ALLOWED_TAGS: ['item', 'title', 'description', 'relink']
          });

        const xml = parser.parseFromString(cleanData, 'text/xml');
        const items = xml.getElementsByTagName('item');
          const maxitem = 10; //items.length;

          for (let i = 0; i < maxitem; i++) {
            let itemnumber = i;
            let title = items[i].getElementsByTagName('title')[0].textContent;
            let description = items[i].getElementsByTagName('description')[0].textContent;
            let linkurl = items[i].getElementsByTagName('relink')[0].textContent;
                
            //////
            let imagesrc = "";
            let metadescr = "";
            let pubdate = "";
                getMetaFeedData(linkurl)
                .then(metadata => {
                    if (metadata != undefined) {
                        if (metadata["m_description"]) {
                            metadescr = metadata["m_description"]
                        }
                        if (metadata["m_url"]) {
                            linkurl = metadata["m_url"]
                        }
                        if (metadata["m_pubdate"]) {
                            pubdate = metadata["m_pubdate"]
                        }
                        if (metadata["m_img"]) {
                            return fetchAndCropImage(metadata["m_img"]);
                        }
                    }
                })
                .then(imagedata => {
                    imagesrc = imagedata;
                    let feedid = newsfeed["feedid"];
                    let feeditem = { itemnumber, feedid, title, description, linkurl, metadescr, imagesrc, pubdate };
                    socket.emit('newsfeeditem', feeditem);
                })
                .catch(error => console.log("could not fetch"));
    
        }
        
      })
      .catch(error => {
        console.log(error);
      });
  
}



// Serve static files from the "public" directory
app.use(express.static('public'));

// Define a route for the home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the server
server.listen(443, () => {
    console.log('listening on *:443');
});
  
  