function updatePopup(bookmark) {
  document.getElementById("bookmark").innerHTML = bookmark;
}

function onGotBackgroundPage(page) {
  randomBookmark = page.randomBookmark();
  console.log("In show_bookmark.js popup. Random bookmark is: " + randomBookmark);

  updatePopup(randomBookmark);
}

function onError(error) {
  console.log(`ErrorL ${error}`);
}

var backgroundPage = browser.runtime.getBackgroundPage();
backgroundPage.then(onGotBackgroundPage, onError);
