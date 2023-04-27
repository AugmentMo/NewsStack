
function isSessionDataAvailable() {
    return sessionStorage.getItem('newsstacksession') != null;
}

function saveSessionData() {
    const sessiondata = { 'newsfeeds': newsfeeds };
    const sessiondata_jsonstr = JSON.stringify(sessiondata)
    sessionStorage.setItem('newsstacksession', sessiondata_jsonstr);
}

function loadSessionData() {
    const sessiondata_jsonstr = sessionStorage.getItem('newsstacksession');
    const sessiondata = JSON.parse(sessiondata_jsonstr);
    newsfeeds = sessiondata["newsfeeds"];
}

function clearSessionData() {
    sessionStorage.removeItem('newsstacksession');
}


// Check if session data is available, otherwise load default feeds
if (!isSessionDataAvailable()) {
    // Default example feeds
    console.log("Could not find session. Loading default example feeds..");

    addNewFeed("Elon Musk", "elonmusk", "Elon+Musk", "googlenewsrss");
    addNewFeed("Artificial Intelligence", "artificialintelligence", "Artificial+Intelligence", "googlenewsrss");
    addNewFeed("Stock Market", "stockmarket", "Stock+Market", "googlenewsrss");
    addNewFeed("World Politics", "worldpolitics", "World+Politics", "googlenewsrss");

    requestNewsFeeds();
}
else {
    console.log("Found prior session. Loading prior session feeds..");
    loadSessionData();
    requestNewsFeeds();
}