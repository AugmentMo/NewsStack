
function isSessionDataAvailable() {
    return localStorage.getItem('newsstacksession') != null;
}

function saveSessionData() {
    const sessiondata = { 'newsfeeds': newsfeeds };
    const sessiondata_jsonstr = JSON.stringify(sessiondata)
    localStorage.setItem('newsstacksession', sessiondata_jsonstr);
}

function loadSessionData() {
    const sessiondata_jsonstr = localStorage.getItem('newsstacksession');
    const sessiondata = JSON.parse(sessiondata_jsonstr);
    newsfeeds = sessiondata["newsfeeds"];
}

function clearSessionData() {
    localStorage.removeItem('newsstacksession');
}

// Try using exsiting local storage data
function useLocalStorageSession() {
    // Check if session data is available, otherwise load default feeds
    if (!isSessionDataAvailable()) {
        // Default example feeds
        console.log("Could not find session. Loading default example feeds..");

        addNewFeed("Mars Rovers", "marsrovers", "Mars Rovers", "googlenewsrss");
        addNewFeed("Chuck Norris", "chucknorris", "Chuck Norris", "googlenewsrss");
        addNewFeed("Competitive Eating", "competitiveeating", "Competitive Eating", "googlenewsrss");
        addNewFeed("Artificial Intelligence", "artificialintelligence", "Artificial Intelligence", "googlenewsrss");

        requestNewsFeeds();
    }
    else {
        console.log("Found prior session. Loading prior session feeds..");
        loadSessionData();
        requestNewsFeeds();
    }
}