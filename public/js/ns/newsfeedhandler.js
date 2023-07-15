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

function addItemToFeedTab(feedid, item, tabidprefix) {
    const container = document.getElementById(tabidprefix + feedid);

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

    // Right container with image and top buttons
    const rightContainer = document.createElement('div');
    rightContainer.classList.add('col');
    rightContainer.classList.add('d-flex');
    rightContainer.style.paddingLeft = '0px';
    var htmlstr = ''
    var imghtml = ''

    if (item.imagesrc != undefined && item.imagesrc) {
        imghtml = '<img src="' + item.imagesrc + '" alt="' + item.title + '" style="">';
    }

    htmlstr = `
    <div class="col" style="height: 100%; padding-left: 0px;">
        <div style="position: absolute; right: 20px; top: 22px; width: 90px; justify-content: end;" class="row">
                <button data-stack-id="`+feedid+`" data-fuid="`+item.fuid+`" type="button" class="btn btn-newscol btn-newsitem-bookmark btn-icon" style="display: inline-flex; width: 30px;">
                    <i class="ti-bookmark text-dark"></i>
                </button>
                <button data-stack-id="`+feedid+`" data-fuid="`+item.fuid+`" type="button" class="btn btn-newscol btn-newsitem-archiv btn-icon" style="display: inline-flex; width: 30px;">
                    <i class="ti-check text-dark" style=""></i>
                </button>
        </div>
        <div class="row" style="width: 100%; justify-content: center; margin: 0px; margin-top: 10px;">
                `+imghtml+`
        </div>
    </div>
    `

    rightContainer.innerHTML = htmlstr;

    const leftContainer = document.createElement('div');
    leftContainer.classList.add('col');
    leftContainer.classList.add(( (item.imagesrc != undefined && item.imagesrc) ? 'col-cust-img' : 'col-cust-noimg'));

    const cardBodyElement = document.createElement('div');
    cardBodyElement.classList.add('card-body');

    cardBodyElement.appendChild(title);
    cardBodyElement.appendChild(description);
    // cardBodyElement.appendChild(url);
    cardBodyElement.appendChild(pubdate);

    leftContainer.appendChild(cardBodyElement);

    const rowElement = document.createElement('div');
    rowElement.classList.add('row');
    rowElement.classList.add('justify-content-between');


    const feedElement = document.createElement('div');
    feedElement.classList.add('card');
    feedElement.classList.add('mt-2');
    feedElement.classList.add('feeditem');


    rowElement.appendChild(leftContainer);
    rowElement.appendChild(rightContainer);
    feedElement.appendChild(rowElement);
    feedElement.addEventListener("click", function() {
        if (item.linkurl) {
            window.open(item.linkurl, "_blank");
        }
      });
    container.appendChild(feedElement);
    registerFeedItemButtonEventListeners()
}

function addLoadMoreItemToFeed(feedid) {
    const container = document.getElementById("tab-news-"+feedid);
    
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
    // Clear all tabs
    document.getElementById("tab-bookmarks-" + feedid).innerHTML = "";
    document.getElementById("tab-archive-" + feedid).innerHTML = "";
    document.getElementById("tab-news-" + feedid).innerHTML = "";
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

function addItemToBookmarks(feedid, fuid) {
    newsfeeds[feedid]["bookmarks"].push(fuid)
}

function removeItemFromBookmarks(feedid, fuid) {
    newsfeeds[feedid]["bookmarks"] = newsfeeds[feedid]["bookmarks"].filter(function (item) {
        return item != fuid;
    });
}

function addItemToArchive(feedid, fuid) {
    newsfeeds[feedid]["archive"].push(fuid)
}

function removeItemFromArchive(feedid, fuid) {
    newsfeeds[feedid]["archive"] = newsfeeds[feedid]["archive"].filter(function (item) {
        return item != fuid;
    });
}

function isItemBookmarked(feedid, fuid) {
    let bookmarks = newsfeeds[feedid]["bookmarks"]
    
    for (const item of bookmarks) {
        if (item == fuid) {
            return true;
        }
    }

    return false
}

function isItemArchived(feedid, fuid) {
    let bookmarks = newsfeeds[feedid]["archive"]
    
    for (const item of bookmarks) {
        if (item == fuid) {
            return true;
        }
    }

    return false
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
            if (isItemBookmarked(feedid, feeditem.fuid)) {
                addItemToFeedTab(feedid, feeditem, "tab-bookmarks-")
            }
            else if (isItemArchived(feedid, feeditem.fuid)) {
                addItemToFeedTab(feedid, feeditem, "tab-archive-")
            }
            else {
                addItemToFeedTab(feedid, feeditem, "tab-news-")
            }
            
        }

        // Add load more item
        addLoadMoreItemToFeed(feedid);
    }

}

function addNewFeed(feedtitle, feedid, feedkeywordstr, newssource) {
    newsfeeds[feedid] = { "feedtitle": feedtitle, "feedkeywordstr": feedkeywordstr, "newssource": newssource, "feeditems": [], "bookmarks": [], "archive": []}
    saveSessionData();
    saveNSData();
}

function updateFeed(feedid, feedtitle, feedkeywordstr, newssource, feeditems = null) {
    var newfeeditems = newsfeeds[feedid]["feeditems"];
    var newfeedbookmarks = newsfeeds[feedid]["bookmarks"];
    var newfeedarchive = newsfeeds[feedid]["archive"];

    if (feeditems != null) {
        newfeeditems = feeditems;
    }

    newsfeeds[feedid] = { "feedtitle": feedtitle, "feedkeywordstr": feedkeywordstr, "newssource": newssource, "feeditems": newfeeditems, "bookmarks": newfeedbookmarks, "archive": newfeedarchive }
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
                <button data-stack-id="`+feedid+`" type="button" class="btn btn-newscol btn-newscol-settings btn-icon" style="margin-right: 0.5rem;">
                    <i class="ti-settings text-dark"></i>
                </button>
                <button data-stack-id="`+feedid+`" type="button" class="btn btn-newscol btn-newscol-trash btn-icon">
                    <i class="ti-trash text-dark"></i>
                </button>
            </div>
        </div>
                
        <ul class="nav nav-tabs nav-justified" id="newsfeedtab-nav-`+ feedid +`" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="tab-news-`+ feedid +`-tab" data-bs-toggle="tab" data-bs-target="#tab-news-`+ feedid +`" type="button" role="tab" aria-controls="tab-news-`+ feedid +`" aria-selected="true">News</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="tab-bookmarks-`+ feedid +`-tab" data-bs-toggle="tab" data-bs-target="#tab-bookmarks-`+ feedid +`" type="button" role="tab" aria-controls="tab-bookmarks-`+ feedid +`" aria-selected="false">Bookmarks</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="tab-archive-`+ feedid +`-tab" data-bs-toggle="tab" data-bs-target="#tab-archive-`+ feedid +`" type="button" role="tab" aria-controls="tab-archive-`+ feedid +`" aria-selected="false">Archive</button>
            </li>
        </ul>
        <div class="tab-content p-0 border-0" id="newsfeedtab-content-`+ feedid +`">
            <div class="tab-pane fade show active" id="tab-news-`+ feedid +`" role="tabpanel" aria-labelledby="tab-news-`+ feedid +`-tab"></div>
            <div class="tab-pane fade" id="tab-bookmarks-`+ feedid +`" role="tabpanel" aria-labelledby="tab-bookmarks-`+ feedid +`-tab"></div>
            <div class="tab-pane fade" id="tab-archive-`+ feedid +`" role="tabpanel" aria-labelledby="tab-archive-`+ feedid +`-tab"></div>
        </div>
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
    
    if (newsfeeds.hasOwnProperty(feedid)) {
        let feedItemsArray = newsfeeds[feedid]["feeditems"];
    
        // Check if the feed item already exists in the feed items array
        var existingFeedItemIndex = feedItemsArray.findIndex(function (item) {
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

