document.addEventListener('DOMContentLoaded', function() {
  //Set Enabled Icon
  chrome.browserAction.setIcon({
    path : {
      "19": "images/icon-enable.png",
    }
  });

  // Get current tab information
  chrome.tabs.query({active: true}, function(tabs) {
      //Send message to background process
      chrome.runtime.sendMessage(null, tabs[0], function(resp) {
      });
  });

});