var bookmarks = [];

function onRejected(error) {
  console.log(`An error: ${error}`);
}

function updateSettingsWithBookmarks(folders) {
  console.log("4. Update settings")
  console.log(folders);
  let folderElement = document.getElementById("folders");
  let bookmarksHtml = "<ul>";
  for(i = 0; i < bookmarks.length; i++) {
    let checked = "";
    //console.log(bookmarks[i]);
    if(folders[i] == "on"){
      console.log("This is checked");
      checked = "checked=''";
    }
    //console.log("Insie for loop");
    bookmarksHtml += "<li>";
    bookmarksHtml += `<input type="checkbox" id="folder${i}" name="bookmarks[]" class="bookmarks_value" ${checked}>`
    bookmarksHtml += bookmarks[i];
    bookmarksHtml += "</li>"
  }

  bookmarksHtml += "</ul>";
  folderElement.innerHTML = bookmarksHtml;

}

function getBookmarks2() {
  return new Promise(function(resolve,reject){
    console.log("2. Get bookmarks")
    allBookmarksTree = browser.bookmarks.getTree();
    allBookmarksTree
        .then(extractBookmarkFoldersFromTree, onRejected)
        .then(updateSettingsWithBookmarks);
    resolve(bookmarks);
  });


  //console.log(bookmarks);
}

function getBookmarks(folders) {
  return new Promise(function(resolve,reject){
    console.log("2. Get bookmarks")
    allBookmarksTree = browser.bookmarks.getTree();
    allBookmarksTree.then(function(result) {
      extractBookmarkFoldersFromTree(result);
    }).then(function() {
      updateSettingsWithBookmarks(folders);
    }).then(function() {
      setCheckboxes();
    });

    resolve("All done");
  });


  //console.log(bookmarks);
}

function extractBookmarkFoldersFromTree(bookmarkItems) {
  return new Promise(function(resolve) {
    console.log("3. Extract")
    resolve(extractFoldersFromTreeNode(bookmarkItems[0]));
    //console.log("All bookmark folders extracted");
  });
}

function extractBookmarkFoldersFromTree2(bookmarkItems) {
    console.log("3. Extract")
    extractFoldersFromTreeNode(bookmarkItems[0]);
    //console.log("All bookmark folders extracted");
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
  console.log(document.querySelector("#folder").value);

  //let foldersToSave = document.querySelectorAll("input[type=checkbox]");
  let foldersToSave = document.getElementsByName('bookmarks[]');

  folderValues = document.getElementsByClassName('bookmarks_value'),
    foldersToSave = [].map.call(folderValues, function(input) {
      if (input.checked) {
        return "on";
      }else{
        return "off";
      }
    });
  //console.log(foldersToSave);
  for (i = 0; i < foldersToSave.length; i++) {
    //console.log(foldersToSave[i]);
  }
  
  // Sets the stored value
  browser.storage.sync.set({
    color: document.querySelector("#folder").value,
    folders: foldersToSave
  });
}

function setCheckboxes(){
  console.log("5. Set checkboxes");
  let checkboxElements = document.getElementsByClassName("bookmarks_value");
  console.log(checkboxElements);
  for (let i = 0; i < checkboxElements.length; i++){

    if(bookmarks[i] == "on"){
      checkboxElements[i].checked = true;
    }
    //console.log("Hello");
    //console.log(checkboxElements[i]);
  }
}

function restoreOptions() {

  function setCurrentChoice(result) {
    console.log("1. Set current choise")

    getBookmarks(result.folders);
    //console.log(result);
    document.querySelector("#folder").value = result.folder || "blue";
    //document.querySelector("input[type=checkbox]").value = result.folders || "off";
    //console.log(result.folders);
    let checkboxElements = document.getElementsByClassName("bookmarks_value");
    for (let i = 0; i < checkboxElements.length; i++){

      if(bookmarks[i] == "on"){
        checkboxElements[i].checked = true;
      }
      console.log("Hello");
      console.log(checkboxElements[i]);
    }
    document.querySelectorAll(".bookmarks_value").value = result.folders || "off";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  // Gets the browser storage value
  var getting = browser.storage.sync.get();
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
