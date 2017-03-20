var interceptor = {
    enabledTab : {
        windowId: null,
        id: null,
        domain: ''
    }
};

// Listen to events when popup (enabledTab) is sending messages.
chrome.runtime.onMessage.addListener(
    function (tabToEnable, sender, sendResponse) {
        interceptor.enabledTab.windowId = tabToEnable.windowId;
        interceptor.enabledTab.id = tabToEnable.id;
        interceptor.enabledTab.domain = getDomain(tabToEnable.url);
        sendResponse('BACKGROUND: I received the new enabled tab information');
    }
);

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    var updatedDomain = getDomain(tab.url);
    if(updatedDomain !== interceptor.enabledTab.domain) {
        disableInterceptor();
    } else {
        enableInterceptor();
    }
});

chrome.tabs.onActivated.addListener(function (activeTab) {
    // Disable the interceptor if its not the chosen tab
    chrome.tabs.query({ active: true}, function(tabs) {
        var activeTab = tabs[0];
        var domain = getDomain(activeTab.url);
        activeTab.domain = domain;
        if(!isEnabledTab(activeTab)) {
            disableInterceptor();
        } else {
            enableInterceptor();
        }
    });
});

function onRequestCompleted(details) {
    console.log(details);
}

function disableInterceptor(tab) {
    console.log('Added event listener');
    setIcon(false);
    chrome.webRequest.onCompleted.removeListener(onRequestCompleted, { urls : ["<all_urls>"]});
};

function enableInterceptor() {
    console.log('Removed event listener');
    setIcon(true);
    chrome.webRequest.onCompleted.addListener(onRequestCompleted, { urls : ["<all_urls>"]});
}

function isEnabledTab(tab) {
    return  (tab.windowId === interceptor.enabledTab.windowId) &&
            (tab.id === interceptor.enabledTab.id) &&
            (tab.domain === interceptor.enabledTab.domain);
}

function setIcon(isEnabled) {
    var icon = isEnabled ? "images/icon-enable.png" : "images/icon.png";
    chrome.browserAction.setIcon({
        path : {
        "19": icon,
        }
    });
}

function getDomain(uri) {
    return uri.match(/^[\w-]+:\/{2,}\[?([\w\.:-]+)\]?(?::[0-9]*)?/)[1];
}