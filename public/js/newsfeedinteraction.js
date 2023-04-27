

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

    <label for="keyword-string">Keyword String:</label><br>
    <input type="text" id="keyword-string">
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
            console.log(`Keyword String: ${keywordString}`);
            addNewFeed(stackTitle, stackID, keywordString, newsSource);
            requestNewsFeed(stackID);
            updateNewsFeedsDisplay();
        }
        }
        }
        });
});


function registerButtonEventListener() {
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
    });
}
