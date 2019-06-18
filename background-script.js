var currentTab;
var currentBookmark;
var folder = "From Google Chrome";
// For testing, open the Browser Console

console.log('hello');
/*
 * Updates the browserAction icon to reflect whether the current page
 * is already bookmarked.
 */
function updateIcon() {
  //console.log(currentBookmark);
  
  browser.browserAction.setIcon({
    path: currentBookmark ? {
      19: "icons/border-48.png",
      38: "icons/border-48.png"
    } : {
      19: "icons/telephone.png",
      38: "icons/telephone.png"
    },
    tabId: currentTab.id
  });
  browser.browserAction.setTitle({
    // Screen readers can see the title
    title: currentBookmark ? 'Unbookmark it!' : 'Bookmark it!',
    tabId: currentTab.id
  }); 
}

/*
 * Add or remove the bookmark on the current page.
 */
function toggleBookmark() {
  // console.log(currentBookmark);
  
  if (currentBookmark) {
    browser.bookmarks.remove(currentBookmark.id);
  } else {
    //browser.bookmarks.create({title: currentTab.title, url: currentTab.url});
  }

  randomBookmark();
  
}

function makeIndent(indentLength) {
  return ".".repeat(indentLength);
}

function logItems(bookmarkItem, indent) {
  if (bookmarkItem.url) {
    
    console.log(bookmarkItem);
    //console.log(makeIndent(indent) + bookmarkItem.url);
  } else if (bookmarkItem.title == folder) {
    console.log(bookmarkItem.title);
  } else {
    console.log(bookmarkItem);
    //console.log(makeIndent(indent) + "Folder");
    indent++;
  }
  if (bookmarkItem.children) {
    for (child of bookmarkItem.children) {
      logItems(child, indent);
    }
  }
  indent--;
}

function logTree(bookmarkItems) {
  //console.log(bookmarkItems);
  logItems(bookmarkItems[0], 0);
}

function onRejected(error) {
  console.log(`An error: ${error}`);
}

function alertRandomBookmark(bookmarkItems) {
  console.log(bookmarkItems);
  bookmarkItems = bookmarkItems[0];
  randomGenerator = Math.floor(Math.random()*bookmarkItems.length);
  randomBookmark = bookmarkItems[randomGenerator];
}

/*
 * Choose a random bookmark from the collection
 */
function randomBookmark() {
  subTreeId = "From Google Chrome"
  bookmarksFolder = browser.bookmarks.getSubTree(subTreeId);
  // Returns a promise
  allBookmarksTree = browser.bookmarks.getTree();
  //allBookmarksTree.then(logTree, onRejected).then(alertRandomBookmark, onRejected);
  allBookmarksTree.then(alertRandomBookmark, onRejected);
}

browser.browserAction.onClicked.addListener(toggleBookmark);

/*
 * Switches currentTab and currentBookmark to reflect the currently active tab
 */
function updateActiveTab(tabs) {

  function isSupportedProtocol(urlString) {
    var supportedProtocols = ["https:", "http:", "ftp:", "file:"];
    var url = document.createElement('a');
    url.href = urlString;
    return supportedProtocols.indexOf(url.protocol) != -1;
  }

  function updateTab(tabs) {
    if (tabs[0]) {
      currentTab = tabs[0];
      if (isSupportedProtocol(currentTab.url)) {
        var searching = browser.bookmarks.search({url: currentTab.url});
        searching.then((bookmarks) => {
          currentBookmark = bookmarks[0];
          updateIcon();
        });
      } else {
        console.log(`Bookmark it! does not support the '${currentTab.url}' URL.`)
      }
    }
  }

  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then(updateTab);
}

// listen for bookmarks being created
browser.bookmarks.onCreated.addListener(updateActiveTab);

// listen for bookmarks being removed
browser.bookmarks.onRemoved.addListener(updateActiveTab);

// listen to tab URL changes
browser.tabs.onUpdated.addListener(updateActiveTab);

// listen to tab switching
browser.tabs.onActivated.addListener(updateActiveTab);

// listen for window switching
browser.windows.onFocusChanged.addListener(updateActiveTab);

// update when the extension loads initially
updateActiveTab();
