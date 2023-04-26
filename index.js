const express = require('express');
const fetch = require('node-fetch');
const { DOMParser } = require('xmldom');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { getNewsFeedImage, getMetaFeedData, fetchAndCropImage } = require('./fetchtest');

const app = express();

// Define a route to retrieve the news feeds
app.get('/news', (req, res) => {
  const url = 'https://news.google.com/rss/search?q=haptics&hl=en-NZ&gl=NZ&ceid=NZ:en';
  fetch(url)
    .then(response => response.text())
    .then(async data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, 'text/xml');
      const items = xml.getElementsByTagName('item');
        const feeds = [];
        const maxitem = 5; //items.length;
      for (let i = 0; i < maxitem; i++) {
        const title = items[i].getElementsByTagName('title')[0].textContent;
        const description = items[i].getElementsByTagName('description')[0].textContent;
        var linkurl = items[i].getElementsByTagName('link')[0].textContent;
          

        //////
        var imagesrc = ""
        var metadescr = ""
        await getMetaFeedData(linkurl)
            .then(metadata => {
                if (metadata != undefined) {
                    if (metadata["m_description"]) {
                        metadescr = metadata["m_description"]
                    }
                    if (metadata["m_url"]) {
                        linkurl = metadata["m_url"]
                    }
                    if (metadata["m_img"]) {
                        return fetchAndCropImage(metadata["m_img"]);
                    }
                }
            })
            .then(imagedata => {imagesrc = imagedata}).catch(error => console.log("could not fetch"));
        // await getNewsFeedImage(linkurl).then(imagedata => {imagesrc = imagedata}).catch(error => console.log("could not fetch"));
        //////

        feeds.push({ title, description, linkurl, metadescr, imagesrc });
      }
      res.json(feeds);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Error retrieving news feeds');
    });
});

// Serve static files from the "public" directory
app.use(express.static('public'));

// Define a route for the home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
