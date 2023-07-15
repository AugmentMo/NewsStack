const isNavTogglerVisible = $('.navbar-toggler').is(':visible');

function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  

  // Function to set a cookie with a given name and value
function setCookie(cookieName, cookieValue, expirationDays) {
  var d = new Date();
  d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

// Function to get the value of a cookie with a given name
function getCookie(cookieName) {
  var name = cookieName + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookieArray = decodedCookie.split(';');
  for(var i = 0; i < cookieArray.length; i++) {
    var cookie = cookieArray[i];
    while (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) == 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
}


let activeInputs = new Set();

document.addEventListener("keydown", function(event) {
  activeInputs.add(event.key);
});

document.addEventListener("keyup", function(event) {
  activeInputs.delete(event.key);
});

document.addEventListener("mousedown", function(event) {
  activeInputs.add("mouse");
});

document.addEventListener("mouseup", function(event) {
  activeInputs.delete("mouse");
});

document.addEventListener("touchstart", function(event) {
  activeInputs.add("touch");
});

document.addEventListener("touchend", function(event) {
  activeInputs.delete("touch");
});


function isInputDown() {
  return activeInputs.size > 0;
}