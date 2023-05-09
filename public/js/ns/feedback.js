function showFeedbackModal() {
    let dialog = bootbox.dialog({
        title: 'Feedback',
        message: `
<div>
    <div>
    Please feel free to leave us any kind of feedback below.
    </div>

    <br>

    <label for="feedback-nickname">Nickname:</label><br>
    <input type="text" id="feedback-nickname" placeholder="(optional)">
    
    <br><br>
    
    <label for="feedback-email">Email:</label><br>
    <input type="text" id="feedback-email" placeholder="(optional)">

    <br><br>

    <label for="feedback-textarea">Feedback:</label><br>
    <textarea id="feedback-textarea" class="form-control" rows="5"></textarea>

    <br>
    <div>
    <i>If you want to report a bug, you can also directly 
    <a href="https://github.com/AugmentMo/NewsStack/issues" target="_blank">open an issue on our GitHub Repository <img src="images/github-mark.png" style="width: 16px; height: 16px; vertical-align: top;">.
    </a></i>
    </div>
</div>

        `,
        onShown: function() {},
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
        label: "Submit",
        className: 'btn-dark',
        callback: function() {
            console.log('Feedback submitted');

            const nickname = $('#feedback-nickname').val();
            const email = $('#feedback-nickname').val();
            const feedbacktext = $('#feedback-textarea').val();
            
            let feedbackdata = {
                "feedback-nickname": nickname,
                "feedback-email": email,
                "feedback-text": feedbacktext
            };

            if (feedbacktext.length > 0){
                socket.emit("sendfeedback", feedbackdata);
                bootbox.alert('Thank you for your feedback!');
            }
            else {
                bootbox.alert('You did not enter any feedback.');
            }
            }
            }
      
        }
    });
}