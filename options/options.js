var bookmarks = [];

function onRejected(error) {
  console.log(`An error: ${error}`);
}

function updateSettingsWithBookmarks() {
  console.log("updating sookmarks setting");
  let folderElement = document.getElementById("folders");
  let bookmarksHtml = "<ul>";
  for(i = 0; i < bookmarks.length; i++) {
    //console.log("Insie for loop");
    bookmarksHtml += "<li>";
    bookmarksHtml += `<input type="checkbox" name="bookmark" value="">`
    bookmarksHtml += bookmarks[i];
    bookmarksHtml += "</li>"
  }

  bookmarksHtml += "</ul>";
  folderElement.innerHTML = bookmarksHtml;
}

function getBookmarks() {
  allBookmarksTree = browser.bookmarks.getTree();
  allBookmarksTree.then(extractBookmarkFoldersFromTree, onRejected)
    .then(updateSettingsWithBookmarks);
  //console.log(bookmarks);
}

function extractBookmarkFoldersFromTree(bookmarkItems) {
  return new Promise(function(resolve) {
    resolve(extractFoldersFromTreeNode(bookmarkItems[0]));
    console.log("All bookmark folders extracted");
  });
}

function extractFoldersFromTreeNode(bookmarkItem) {
  //console.log(bookmarkItem);
  //console.log("Extracting bookmarks from tree");
  if (bookmarkItem.type == "folder") {
    //console.log("This is a url:" + bookmarkItem.url);
    bookmarks.push(bookmarkItem.title);

    //console.log(bookmarkItem);
  }
  if (bookmarkItem.children) {
    //console.log("This is another folder");
    for (child of bookmarkItem.children) {
      //console.log("Extracting the bookmarks from this folder");
      extractFoldersFromTreeNode(child);
    }
  }
  //console.log("Bookmarks:" + bookmarks);

}

function extractBookmarksFromTree(bookmarkItems) {
 return new Promise(function(resolve) {
   resolve(extractBookmarksFromTreeNode(bookmarkItems[0]));
   console.log("All bookmarks extracted");
 });
}

function extractBookmarksFromTreeNode(bookmarkItem) {
  //console.log(bookmarkItem);
  //console.log("Extracting bookmarks from tree");
  if (bookmarkItem.url) {
    //console.log("This is a url:" + bookmarkItem.url);
    bookmarks.push(bookmarkItem.url);
    
    //console.log(bookmarkItem);
  }
  if (bookmarkItem.children) {
    //console.log("This is another folder");
    for (child of bookmarkItem.children) {
      //console.log("Extracting the bookmarks from this folder");
      extractBookmarksFromTreeNode(child);
    }
  }
  //console.log("Bookmarks:" + bookmarks);
  
}

function saveOptions(e) {
  e.preventDefault();

  // Sets the stored value
  browser.storage.sync.set({
    color: document.querySelector("#folder").value
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
    getBookmarks();
    console.log(bookmarks);
    document.querySelector("#folder").value = result.folder || "blue";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  // Gets the browser storage value
  var getting = browser.storage.sync.get("folder");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
