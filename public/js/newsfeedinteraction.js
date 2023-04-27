

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
        <option value="google-news">Google News (RSS Feed)</option>
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
        label: "OK",
        className: 'btn-dark',
        callback: function() {
        console.log('Custom OK clicked');
        }
        }
        }
        });
});