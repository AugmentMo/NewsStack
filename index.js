const fetch = require('node-fetch');
const { DOMParser } = require('xmldom');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { getMetaFeedData, fetchAndCropImage } = require('./fetchtest');

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


io.on("connection", (socket) => {
    console.log("socket connected")
    socket.on("getnews", (newsfeed) => {
        console.log("news request")
        collectNews(socket, newsfeed)
    });
});
  

function collectNews(socket, newsfeed) {
    console.log(newsfeed)
    const url = 'https://news.google.com/rss/search?q='+newsfeed["feedkeywordstr"]+'&hl=en-NZ&gl=NZ&ceid=NZ:en';
    fetch(url)
      .then(response => response.text())
      .then(async data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, 'text/xml');
        const items = xml.getElementsByTagName('item');
          const maxitem = 10; //items.length;

          for (let i = 0; i < maxitem; i++) {
            let itemnumber = i;
            let title = items[i].getElementsByTagName('title')[0].textContent;
            let description = items[i].getElementsByTagName('description')[0].textContent;
            let linkurl = items[i].getElementsByTagName('link')[0].textContent;
                
    
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
        res.status(500).send('Error retrieving news feeds');
      });
  
}



// Serve static files from the "public" directory
app.use(express.static('public'));

// Define a route for the home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the server
server.listen(3000, () => {
    console.log('listening on *:3000');
  });
  
  