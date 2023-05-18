var newsfeeds = {};
var newsSources = {"googlenewsrss": "Google News (RSS Feed)"}

function generateRandomString(strlen) {
    let randomString = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < strlen; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return randomString;
  }
  
function generateStackID(text) {
    // Replace all whitespace characters with an empty string
    const noWhitespace = text.replace(/\s/g, '');
    // Convert all characters to lowercase
    const lowercaseText = noWhitespace.toLowerCase();
    // Generate 16 char random string
    const randomString = generateRandomString(16);
    // Return the resulting string
    return lowercaseText+"-"+randomString;
  }

function getFormattedDate(dateString) {
    const date = new Date(dateString);

    // Format the date string in a nice format
    var formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
    });

    if (formattedDate == "Invalid Date") {
        formattedDate = ""
    }

    return formattedDate;
}

function addItemToFeed(feedid, item) {
    const container = document.getElementById('newsfeeditems-'+feedid);

    // Title
    const title = document.createElement('p');
    title.classList.add("card-title");
    if (item.title) {
        title.innerHTML = item.title;
    }

    // Description
    const description = document.createElement('p');
    description.classList.add("font-weight-500");
    if (item.metadescr){
        description.innerHTML = item.metadescr;
    }

    // Url
    // const url = document.createElement('a');
    // url.classList.add("font-weight-500")
    // url.innerHTML = 'Read more';
    // url.target = '_blank';
    // url.href = item.linkurl;

    // Publish date
    const pubdate = document.createElement('p');
    pubdate.classList.add("font-weight-500")
    if (item.pubdate) {
        pubdate.innerHTML = getFormattedDate(item.pubdate);
    }

    // Image
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('col');
    imageContainer.classList.add('d-flex');
    // imageContainer.classList.add('justify-content-end');
    imageContainer.classList.add('align-self-center');
    if (item.imagesrc != undefined && item.imagesrc) {
    imageContainer.innerHTML = '<img src="' + item.imagesrc + '" alt="' + item.title + '" style="width: 100px; height: 100px;">';
    }

    const textContainer = document.createElement('div');
    textContainer.classList.add('col');
    textContainer.classList.add('col-lg-8');


    const cardBodyElement = document.createElement('div');
    cardBodyElement.classList.add('card-body');

    cardBodyElement.appendChild(title);
    cardBodyElement.appendChild(description);
    // cardBodyElement.appendChild(url);
    cardBodyElement.appendChild(pubdate);

    textContainer.appendChild(cardBodyElement);

    const rowElement = document.createElement('div');
    rowElement.classList.add('row');
    rowElement.classList.add('justify-content-between');


    const feedElement = document.createElement('a');
    feedElement.target = '_blank';
    feedElement.classList.add('card');
    feedElement.classList.add('m-2');
    feedElement.classList.add('feeditem');
    if (item.linkurl) {
        feedElement.href = item.linkurl;
    }

    rowElement.appendChild(textContainer);
    rowElement.appendChild(imageContainer);
    feedElement.appendChild(rowElement);
    container.appendChild(feedElement);
}

function addLoadMoreItemToFeed(feedid) {

    // `<div class="card feeditem m-2">
    //     <button type="button" class="btn btn-outline-dark btn-fw" style="border-radius: 10px;">
    //     Load More
    //     </button>
    // </div>`
    const container = document.getElementById('newsfeeditems-'+feedid);

    // Create the outer div element
    const divElement = document.createElement('div');
    divElement.classList.add('card', 'feeditem', 'm-2');

    // Create the button element
    const buttonElement = document.createElement('button');
    buttonElement.type = 'button';
    buttonElement.classList.add('btn', 'btn-outline-dark', 'btn-fw');
    buttonElement.style.borderRadius = '10px';
    buttonElement.textContent = 'Load More';
    buttonElement.addEventListener('click', function () {
        requestMoreFeedItems(feedid);
    });

    // Append the button element to the div element
    divElement.appendChild(buttonElement);

    container.appendChild(divElement);
}

function clearNewsContainer() {
    const container = document.getElementById('news-container');
    container.innerHTML = "";
}

function clearNewsFeedItems(feedid) {
    const container = document.getElementById('newsfeeditems-'+feedid);
    container.innerHTML = "";
}


function updateNewsFeedContainers() {
    clearNewsContainer();

    for (const feedid in newsfeeds) {
        var newsfeed = newsfeeds[feedid]["feeditems"];

        // add news feed column to html
        htmlAddFeed(feedid);
    }

    registerButtonEventListener();
}

function updateNewsFeedsItems() {

    for (const feedid in newsfeeds) {
        var newsfeed = newsfeeds[feedid]["feeditems"];

        clearNewsFeedItems(feedid);

        // sort news feed
        newsfeed.sort((a, b) => {
            return (a.itemnumber < b.itemnumber ? -1 : 1);
        });

        // add each item
        for (const feeditem of newsfeed) { 
            addItemToFeed(feedid, feeditem)
        }

        // Add load more item
        addLoadMoreItemToFeed(feedid);
    }

}

function addNewFeed(feedtitle, feedid, feedkeywordstr, newssource) {
    newsfeeds[feedid] = { "feedtitle": feedtitle, "feedkeywordstr": feedkeywordstr, "newssource": newssource, "feeditems": [] }
    saveSessionData();
    saveNSData();
}

function updateFeed(feedid, feedtitle, feedkeywordstr, newssource, feeditems = null) {
    var newfeeditems = newsfeeds[feedid]["feeditems"];
    if (feeditems != null) {
        newfeeditems = feeditems;
    }
    newsfeeds[feedid] = { "feedtitle": feedtitle, "feedkeywordstr": feedkeywordstr, "newssource": newssource, "feeditems": newfeeditems }
    saveSessionData();
    saveNSData();
}

function htmlAddFeed(feedid) {
    const feedtitle = newsfeeds[feedid]["feedtitle"];
    
    const container = document.getElementById('news-container');

    container.innerHTML += `
    <div id="newsfeed-`+feedid+`" class="col grid-margin feedcolumn">
        <div style="display: flex; justify-content: space-between; align-items: center; padding-left: 1.25rem; padding-right: 1.25rem;">
            <h3 style="margin: 0;">`+feedtitle+`</h3>
            <div style="display: flex; align-items: center;">
                <button data-stack-id="`+feedid+`" type="button" class="btn btn-newscol btn-newscol-settings btn-rounded btn-icon" style="margin-right: 0.5rem;">
                    <i class="ti-settings text-dark"></i>
                </button>
                <button data-stack-id="`+feedid+`" type="button" class="btn btn-newscol btn-newscol-trash btn-rounded btn-icon">
                    <i class="ti-trash text-dark"></i>
                </button>
            </div>
        </div>
        <div id="newsfeeditems-`+feedid+`"></div>
    </div>
    `
}

function deleteFeed(feedid) {
    delete newsfeeds[feedid];
    saveSessionData();
    saveNSData();
    updateNewsFeedContainers();
}

function addNewFeedItem(item) {
    // add item and sort
    const feedid = item.feedid;
    newsfeeds[feedid]["feeditems"].push(item);
}

function updateFeedItem(feedItem) {
    console.log("updating feed item", feedItem)
    const feedid = feedItem.feedid;
    let feedItemsArray = newsfeeds[feedid]["feeditems"];
    
    // Check if the feed item already exists in the feed items array
    var existingFeedItemIndex = feedItemsArray.findIndex(function(item) {
        return item.itemnumber === feedItem.itemnumber;
    });
    
    if (existingFeedItemIndex !== -1) {
        console.log("FOUND and UPDATING", existingFeedItemIndex)
        // If the feed item already exists, update its values
        feedItemsArray[existingFeedItemIndex] = feedItem;
    } else {
        console.log("NOT FOUND and CREATING")

        // If the feed item does not exist, add it as a new element
        feedItemsArray.push(feedItem);
    }
      
}

function requestNewsFeed(feedid) {
    socket.emit("getnews", {"feedid": feedid, "feedkeywordstr": newsfeeds[feedid]["feedkeywordstr"]});
}

function requestMoreFeedItems(feedid) {
    socket.emit("getnews", {"feedid": feedid, "feedkeywordstr": newsfeeds[feedid]["feedkeywordstr"], "startindex": newsfeeds[feedid]["feeditems"].length, "count": 5});
}


function requestNewsFeeds() {
    for (const feedid in newsfeeds) {
        requestNewsFeed(feedid);
    }
}

socket.on('newsfeeditem', (item) => {
    updateFeedItem(item);
    updateNewsFeedsItems();
});

