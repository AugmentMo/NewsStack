var newsfeeds = {};

function getFormattedDate(dateString) {
    const date = new Date(dateString);

    // Format the date string in a nice format
    const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
    });

    return formattedDate;
}

function addItemToFeed(feedid, item) {
    const container = document.getElementById('newsfeeditems-'+feedid);

    const title = document.createElement('p');
    title.classList.add("card-title");
    title.innerHTML = item.title;

    const description = document.createElement('p');
    description.classList.add("font-weight-500")
    description.innerHTML = item.metadescr;

    const url = document.createElement('a');
    url.classList.add("font-weight-500")
    url.innerHTML = 'Read more';
    url.href = item.linkurl;
    url.target = '_blank';

    const pubdate = document.createElement('p');
    pubdate.classList.add("font-weight-500")
    pubdate.innerHTML = getFormattedDate(item.pubdate);

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('col');
    imageContainer.classList.add('d-flex');
    // imageContainer.classList.add('justify-content-end');
    imageContainer.classList.add('align-self-center');
    if (item.imagesrc != undefined) {
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
    feedElement.href = item.linkurl;
    feedElement.target = '_blank';
    feedElement.classList.add('card');
    feedElement.classList.add('m-2');
    feedElement.classList.add('feeditem');

    rowElement.appendChild(textContainer);
    rowElement.appendChild(imageContainer);

    feedElement.appendChild(rowElement);

    container.appendChild(feedElement);

}

function clearNewsContainer() {
    const container = document.getElementById('news-container');
    container.innerHTML = "";
}

function updateNewsFeedsDisplay() {
    clearNewsContainer();

    for (const feedid in newsfeeds) {
        var newsfeed = newsfeeds[feedid]["feeditems"];

        // sort news feed
        newsfeed.sort((a, b) => {
            return (a.itemnumber < b.itemnumber ? -1 : 1);
        });

        // add news feed column to html
        htmlAddFeed(feedid);

        // add each item
        for (const feeditem of newsfeed) { 
            addItemToFeed(feedid, feeditem)
        }
    }

    registerButtonEventListener();
}

function addNewFeed(feedtitle, feedid, feedkeywordstr) {
    newsfeeds[feedid] = { "feedtitle": feedtitle, "feedkeywordstr": feedkeywordstr, "feeditems": [] }
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
}

function addNewFeedItem(item) {
    // add item and sort
    const feedid = item.feedid;
    newsfeeds[feedid]["feeditems"].push(item);
}

function requestNewsFeeds() {
    for (const feedid in newsfeeds) {
        socket.emit("getnews", {"feedid": feedid, "feedkeywordstr": newsfeeds[feedid]["feedkeywordstr"]});
    }
}

socket.on('newsfeeditem', (item) => {
    addNewFeedItem(item);
    updateNewsFeedsDisplay();
});


addNewFeed("Elon Musk", "elonmusk", "Elon+Musk");
addNewFeed("Artificial Intelligence", "artificialintelligence", "Artificial+Intelligence");
addNewFeed("Stock Market", "stockmarket", "Stock+Market");
addNewFeed("World Politics", "worldpolitics", "World+Politics");

requestNewsFeeds();