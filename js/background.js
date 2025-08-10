// Background script for Manifest V3
chrome.runtime.onInstalled.addListener(() => {
        chrome.storage.sync.get(['blockingMethod', 'redirectUrl', 'customMessage', 'blockedLinks'], (result) => {
        if (!result.blockingMethod) {
            chrome.storage.sync.set({
                blockingMethod: 'redirect',
                redirectUrl: 'https://www.google.com',
                customMessage: 'This content has been blocked by your safety filter.',
                blockedLinks: []
            });
        }
    });
});

// Handle tab updates to check for blocked content
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // Check if URL should be blocked based on user's custom blocked links
        chrome.storage.sync.get(['blockedLinks'], (result) => {
            const blockedLinks = result.blockedLinks || [];
            const currentUrl = new URL(tab.url);
            
            for (const blockedPattern of blockedLinks) {
                if (isUrlMatched(currentUrl.href, blockedPattern)) {
                    // Get blocking preferences
                    chrome.storage.sync.get(['blockingMethod', 'redirectUrl'], (settings) => {
                        if (settings.blockingMethod === 'redirect') {
                            chrome.tabs.update(tabId, { url: settings.redirectUrl || 'https://www.google.com' });
                        }
                    });
                    break;
                }
            }
        });
    }
});

// Helper function to match URLs with wildcards
function isUrlMatched(url, pattern) {
    // Convert wildcard pattern to regex
    const regexPattern = pattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '\\?');
    
    const regex = new RegExp(regexPattern, 'i');
    return regex.test(url);
}