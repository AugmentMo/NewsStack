let isScrolling;
var stoppedScrolling = true;
var consumeArtificialEvent = 0;

function anchorScrolling() {
  let width = window.outerWidth;
  let offset = 15;

  if (width <= 767){
    if (stoppedScrolling && !isInputDown()){
      let scrollEl = $("#news-container");
      // get current scroll position
      const scrollLeft = scrollEl.scrollLeft();

      // round scroll position to nearest 100px increment
      const roundedScrollLeft = ( isNavTogglerVisible ? 0: -2*offset) + Math.round(scrollLeft / (width-offset)) * (width-offset);

      // set new scroll position
      if (scrollLeft < roundedScrollLeft) {
        consumeArtificialEvent += 1;
        scrollEl.scrollLeft(scrollLeft + Math.max((roundedScrollLeft - scrollLeft) * 0.10, 1));

      } else if (scrollLeft > roundedScrollLeft) {
        consumeArtificialEvent += 1;
        scrollEl.scrollLeft(scrollLeft + Math.min((roundedScrollLeft - scrollLeft) * 0.10, -1));
      }
    }
  }
}

function setIsScrolling() {
  // Clear the timeout function on every scroll event
  window.clearTimeout(isScrolling);
  stoppedScrolling = false;

  // Set a timeout to detect the end of the scroll
  isScrolling = setTimeout(function () {
    stoppedScrolling = true;
  }, 500); // Adjust the timeout value according to your needs
}

$(function () {
  $(".custom-scroller").scroll(function (event) {
    if (consumeArtificialEvent) {
      consumeArtificialEvent -= 1;
    }
    else {
      setIsScrolling();
    }

    consumeArtificialEvent += 1;
    $("#news-container").scrollLeft($(".custom-scroller").scrollLeft());

  });

  $("#news-container").scroll(function (event) {
    if (consumeArtificialEvent) {
      consumeArtificialEvent -= 1;
    }
    else {
      setIsScrolling();
    }

    consumeArtificialEvent += 1;
    $(".custom-scroller").scrollLeft($("#news-container").scrollLeft());

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

// Continuously adjust scroller to achnor
setInterval(function() {
  anchorScrolling();
}, 10);

