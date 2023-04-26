var newsfeeds = {};


function addItemToFeed(feed, item) {
    const container = document.getElementById('news-container-'+feed);

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
    cardBodyElement.appendChild(url);

    textContainer.appendChild(cardBodyElement);

    const rowElement = document.createElement('div');
    rowElement.classList.add('row');
    rowElement.classList.add('justify-content-between');


    const feedElement = document.createElement('p');
    feedElement.href = item.linkurl;
    feedElement.target = '_blank';
    feedElement.classList.add('card');
    feedElement.classList.add('m-2');

    rowElement.appendChild(textContainer);
    rowElement.appendChild(imageContainer);

    feedElement.appendChild(rowElement);

    container.appendChild(feedElement);

}

function updateNewsFeedsDisplay() {
    for (const newsfeedname in newsfeeds) {
        var newsfeed = newsfeeds[newsfeedname];

        // sort news feed
        newsfeed.sort((a, b) => {
            return (a.itemnumber < b.itemnumber ? -1 : 1);
        });

        // clear news feeds
        const container = document.getElementById('news-container-'+newsfeedname);
        container.innerHTML = "";

        // add each item
        for (const newsfeeditem of newsfeed) { 
            addItemToFeed(newsfeedname, newsfeeditem)
        }
    }
}

function addNewFeed(feedname) {
    newsfeeds[feedname] = []
}

function addNewFeedItem(item) {
    // add item and sort
    const newsfeedname = item.newscolumn;
    newsfeeds[newsfeedname].push(item);
}

function requestNewsFeeds() {
    for (const newsfeed in newsfeeds) {
        socket.emit("getnews", newsfeed);
    }
}

socket.on('newsfeeditem', (item) => {
    addNewFeedItem(item);
    updateNewsFeedsDisplay();
});


addNewFeed("haptics");
requestNewsFeeds();