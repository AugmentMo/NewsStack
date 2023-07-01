$(function(){
    $(".custom-scroller").scroll(function(){
        $("#news-container")
            .scrollLeft($(".custom-scroller").scrollLeft());
    });
    $("#news-container").scroll(function(){
        $(".custom-scroller")
            .scrollLeft($("#news-container").scrollLeft());
    });
});

const newsContainer = document.getElementById("news-container");
const scrollbarContainer = document.getElementsByClassName("custom-scroller-content")[0];

// Set the initial width of the second element to match the first element
scrollbarContainer.style.width = newsContainer.scrollWidth + "px";

// Continuously check for changes in the width of the first element
setInterval(function() {
  const newWidth = newsContainer.scrollWidth;
  if (newWidth !== parseInt(scrollbarContainer.style.width)) {
    scrollbarContainer.style.width = newWidth + "px";
  }
}, 100);

