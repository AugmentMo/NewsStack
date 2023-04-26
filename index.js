const express = require('express');
const fetch = require('node-fetch');
const { DOMParser } = require('xmldom');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const app = express();


function fetchImageData(url) {

    fetch(url)
    .then(response => response.text())
    .then(data => {
        var resurl =""
        const regex = /<a href="(.*?)"/;
        const match = data.match(regex);
        if (match) {
            resurl = match[1];
        } else {
            console.log('No URL found in HTML');
        }

        console.log(resurl)
        fetch(resurl)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const title = doc.querySelector('title').innerText;
            const description = doc.querySelector('meta[name="description"]').getAttribute('content');
            const img = doc.querySelector('meta[name="image"]').getAttribute('content');
            
            console.log('Title:', title);
            console.log('Description:', description);
            console.log('Img:', img);
        })
    })
    .catch(error => console.error(error));

}

function getMetaData(resurl) {
    console.log(resurl)
    fetch(resurl)
    .then(response => response.text())
    .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const title = doc.querySelector('title').innerText;
        const description = doc.querySelector('meta[name="description"]').getAttribute('content');
        const img = doc.querySelector('meta[name="image"]').getAttribute('content');
        
        console.log('Title:', title);
        console.log('Description:', description);
        console.log('Img:', img);
    })
    
  
}

// Define a route to retrieve the news feeds
app.get('/news', (req, res) => {
  const url = 'https://news.google.com/rss/search?q=haptics&hl=en-NZ&gl=NZ&ceid=NZ:en';
  fetch(url)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, 'text/xml');
      const items = xml.getElementsByTagName('item');
      const feeds = [];
      for (let i = 0; i < items.length; i++) {
        const title = items[i].getElementsByTagName('title')[0].textContent;
        const description = items[i].getElementsByTagName('description')[0].textContent;
        const linkurl = items[i].getElementsByTagName('link')[0].textContent;
          

        //////
        fetchImageData(linkurl)
        
        //////

        feeds.push({ title, description, linkurl, imgdata });
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
