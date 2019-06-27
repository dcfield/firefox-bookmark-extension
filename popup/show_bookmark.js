/*
function makeHttpObject() {
  try {return new XMLHttpRequest();}
  catch (error) {console.log("Error creating XMLHttpsRequest");}
  try {return new ActiveXObject("Msxml2.XMLHTTP");}
  catch (error) {}
  try {return new ActiveXObject("Microsoft.XMLHTTP");}
  catch (error) {}

  throw new Error("Could not create HTTP request object.");
}

function getUrlHtml(url) {
  var request = makeHttpObject();
  
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      console.log("Request returned successfully");
      return request.responseText;
    }
  }

  request.open("GET", url, true);
  request.send();
}

function getPageTitle(bookmark) {
  var page_html = getUrlHtml(bookmark);
  console.log(page_html);
  //var page_title = page_html.match(/<title[^>]*>([^<]+)<\/title>/)[1];
  //console.log("PAge title is:" + page_title);
}
*/

var randomBookmark = "";

function updatePopup(bookmark) {
  document.getElementById("bookmark").innerHTML = bookmark;
  document.getElementById("bookmark_link").href = bookmark;
  //getPageTitle(bookmark);
}
function onGotBackgroundPage(page) {
  randomBookmark = page.randomBookmark();
  bookmarks = page.getAllBookmarks();
  //console.log("In show_bookmark.js popup. Random bookmark is: " + randomBookmark);

  updatePopup(randomBookmark);
}

function loadNewBookmark() {
  updatePopup(randomBookmark); 
}

function getNewRandomBookmark() {
  random = Math.floor(Math.random() * bookmarks.length);
  return bookmarks[random];
}

function onError(error) {
  console.log(`ErrorL ${error}`);
}

var backgroundPage = browser.runtime.getBackgroundPage();
backgroundPage.then(onGotBackgroundPage, onError);

document.getElementById("bookmark_reload").addEventListener("click", function() {
  //console.log("These are the bookmarks");
  //console.log(bookmarks);
  newRandomBookmark = getNewRandomBookmark();
  updatePopup(newRandomBookmark);
});
