function saveOptions(e) {
  e.preventDefault();

  // Sets the stored value
  browser.storage.sync.set({
    color: document.querySelector("#folder").value
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#folder").value = result.color || "blue";
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
