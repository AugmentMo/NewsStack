

$("#addnewsstackbtn").on("click", (event) => {
    let dialog = bootbox.dialog({
        title: 'Add New Stack',
        message: `
<div>
    <label for="stack-title">Stack Title:</label><br>
    <input type="text" id="stack-title">

    <br><br>

    <label for="news-source">News Source:</label><br>
    <select id="news-source">
        <option value="googlenewsrss">`+newsSources["googlenewsrss"]+`</option>
    </select>

    <br><br>

    <label for="keyword-string">Search String:</label><br>
    <input type="text" id="keyword-string">

    <br><br>


</div>

        `,
        onShown: function() {
            // Add keyword string tooltip
            $('#keyword-string').attr('data-toggle', 'tooltip');
            $('#keyword-string').attr('data-placement', 'right');
        
            $('#keyword-string').attr('data-boundary', 'viewport');
            $('#keyword-string').attr('data-boundary-padding', '10');
        
            $('#keyword-string').attr('title', '<strong>Search String Tips:</strong><br><br><ul><li>Enter keywords sparated by whitespaces.</li><li>Use <strong>+keyword</strong> to force including a keyword.</li><li>Use <strong>-keyword</strong> to exclude a keyword.</li><li>Use <strong>site:website.com</strong> to only include a certain website.</li></ul>');
                        $('#keyword-string').tooltip({ html: true, placement: 'right' });
                        setTimeout(() => {
                            $('#keyword-string').tooltip("show");    
                        }, 500);
            
                      },
        size: 'medium',
        buttons: {
        cancel: {
        label: "Cancel",
        className: 'btn-outline-dark',
        callback: function(){
        console.log('Custom cancel clicked');
        }
        },
        ok: {
        label: "Add",
        className: 'btn-dark',
        callback: function() {
            console.log('Custom OK clicked');
            const stackTitle = $('#stack-title').val();
            const newsSource = $('#news-source').val();
            const keywordString = $('#keyword-string').val();
            const stackID = generateStackID(stackTitle);
            // Log the values to the console
            console.log(`Stack Title: ${stackTitle}`);
            console.log(`News Source: ${newsSource}`);
            console.log(`Search String: ${keywordString}`);
            addNewFeed(stackTitle, stackID, keywordString, newsSource);
            requestNewsFeed(stackID);
            updateNewsFeedContainers();
        }
            }
      
        }
    });
    



});

function registerFeedItemButtonEventListeners() {
    // Register trash button click event listener
    $(".btn-newsitem-archiv").on("click", (event) => {
        event.stopPropagation();
        event.stopImmediatePropagation();
        
        const stackid = $(event.currentTarget).attr('data-stack-id');
        const fuid = $(event.currentTarget).attr('data-fuid');

        console.log("archiving", stackid, fuid);
        // If in bookmarks then move to archive
        if (isItemBookmarked(stackid, fuid)) {
            console.log("move to archive");
            // 1. Remove from bookmarks
            removeItemFromBookmarks(stackid, fuid);
            // 2. Add to archive
            addItemToArchive(stackid, fuid);
        }
        // If in archive then move to news
        else if (isItemArchived(stackid, fuid)) {
            console.log("move to news");
            // 1. Remove from archive
            removeItemFromArchive(stackid, fuid);
        }
        // If in news then move to archive
        else if (!isItemArchived(stackid, fuid)) {
            console.log("move to archive");
           // 1. Add to archive
            addItemToArchive(stackid, fuid);
        }

        updateNewsFeedsItems();
        saveNSData();
    });

    $(".btn-newsitem-bookmark").on("click", (event) => {
        event.stopPropagation();
        event.stopImmediatePropagation();

        const stackid = $(event.currentTarget).attr('data-stack-id');
        const fuid = $(event.currentTarget).attr('data-fuid');

        // If in archive then move to bookmarks
        if (isItemArchived(stackid, fuid)) {
            // 1. Remove from archive
            removeItemFromArchive(stackid, fuid);

            // 2. Add to bookmarks
            addItemToBookmarks(stackid, fuid);
        }
        // If in bookmarks then move to news
        else if (isItemBookmarked(stackid, fuid)) {
            // 1. Remove from bookmarks
            removeItemFromBookmarks(stackid, fuid);
        }
        // If in news then move to bookmarks
        else if (!isItemBookmarked(stackid, fuid)) {
            // 1. Add to bookmarks
            addItemToBookmarks(stackid, fuid);
        }

        updateNewsFeedsItems();
        saveNSData();
    });
}


function registerButtonEventListener() {

    // Allows deleting stacks 
    $(".btn-newscol-trash").on("click", (event) => {    
        event.stopPropagation();
        event.stopImmediatePropagation();
        const stackid = $(event.currentTarget).attr('data-stack-id');
    
        let dialog = bootbox.dialog({
            title: 'Delete Stack',
            message: `
    <div>
        <p>Do you really want to delete this stack?</p>
    </div>
    
            `,
            size: 'medium',
            buttons: {
            cancel: {
            label: "Cancel",
            className: 'btn-outline-dark',
            callback: function(){
            console.log('Custom cancel clicked');
            }
            },
            ok: {
            label: "Delete",
            className: 'btn-dark',
            callback: function() {
                console.log('Deleting '+stackid);
                deleteFeed(stackid);
                updateNewsFeedsDisplay();
            }
            }
            }
        });
        trk("Stack Trash Buttion", "click")
    });

    // Register settings button click event listener
    // Allows modifying stack settings

    $(".btn-newscol-settings").on("click", (event) => {
        event.stopPropagation();
        event.stopImmediatePropagation();
        const stackid = $(event.currentTarget).attr('data-stack-id');
        var stackTitle = newsfeeds[stackid]["feedtitle"]
        var newsSource = newsfeeds[stackid]["newssource"]
        var keywordString = newsfeeds[stackid]["feedkeywordstr"]
        

        let dialog = bootbox.dialog({
            title: 'Stack Settings',
            message: `
    <div>
        <label for="stack-title">Stack Title:</label><br>
        <input type="text" id="stack-title" value="`+stackTitle+`">
    
        <br><br>
    
        <label for="news-source">News Source:</label><br>
        <select id="news-source">
            <option value="googlenewsrss" selected>`+newsSources["googlenewsrss"]+`</option>
        </select>
    
        <br><br>
    
        <label for="keyword-string">Keyword String:</label><br>
        <input type="text" id="keyword-string" value="`+keywordString+`">
    </div>
    
            `,
            size: 'medium',
            buttons: {
            cancel: {
            label: "Cancel",
            className: 'btn-outline-dark',
            callback: function(){
            console.log('Custom cancel clicked');
            }
            },
            ok: {
            label: "Save",
            className: 'btn-dark',
            callback: function() {
                console.log('Custom OK clicked');
                stackTitle = $('#stack-title').val();
                newsSource = $('#news-source').val();
                keywordString = $('#keyword-string').val();
                // Log the values to the console
                console.log(`Stack Title: ${stackTitle}`);
                console.log(`News Source: ${newsSource}`);
                console.log(`Keyword String: ${keywordString}`);
                updateFeed(stackid, stackTitle, keywordString, newsSource, []);
                requestNewsFeed(stackid);
                updateNewsFeedContainers()
            }
            }
            }
        });
        trk("Stack Settings Buttion", "click");
    });

    

    
}
