// Remove the alert as it's disruptive
console.log("Keep Clean extension content script loaded");


// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.documentElement.style.visibility = 'hidden';
    document.addEventListener('DOMContentLoaded', checkContent);
} else {
    checkContent();
}

function checkContent() {
    
    // Check if current site is clean or NSFW
    const isCleanSite = isClean();
    const isNsfwSite = isNsfw();
    
    console.log("Is clean:", isCleanSite, "Is NSFW:", isNsfwSite);
    
    if (!isCleanSite && isNsfwSite) {
        console.log("Blocking inappropriate content");
        blockContent();
    } else {
        document.documentElement.style.visibility = 'initial';
    }
    
    // // Also check user's custom blocked links
    checkCustomBlockedLinks();
}

function checkCustomBlockedLinks() {
    chrome.storage.sync.get(['blockedLinks'], function(result) {
        const blockedLinks = result.blockedLinks || [];
        const currentUrl = window.location.href;
        
        for (const blockedPattern of blockedLinks) {
            if (isUrlMatched(currentUrl, blockedPattern)) {
                console.log("URL matches blocked pattern:", blockedPattern);
                blockContent();
                break;
            }
        }
    });
}

function isUrlMatched(url, pattern) {
    try {
        // Convert wildcard pattern to regex
        const regexPattern = pattern
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*')
            .replace(/\?/g, '\\?');
        
        const regex = new RegExp(regexPattern, 'i');
        return regex.test(url);
    } catch (e) {
        console.error("Error matching URL pattern:", e);
        return false;
    }
}

function blockContent() {
    // Get user preference from chrome storage
    chrome.storage.sync.get(['blockingMethod', 'redirectUrl', 'customMessage'], function(result) {
        const method = result.blockingMethod || 'redirect';
        const redirectUrl = result.redirectUrl || 'https://www.google.com';
        const message = result.customMessage || 'This content has been blocked by your content filter.';
        
        if (method === 'redirect') {
            // Redirect to predefined URL
            window.location.href = redirectUrl;
        } else if (method === 'message') {
            // Display blocking message
            displayBlockingMessage(message);
        }
    });
}

function displayBlockingMessage(message) {
    // Prevent multiple overlays
    if (document.querySelector('.content-blocker-overlay')) {
        return;
    }
    
    // Create blocking overlay
    const overlay = document.createElement('div');
    overlay.className = 'content-blocker-overlay';
    overlay.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        z-index: 2147483647 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    `;
    
    // Create message container
    const messageContainer = document.createElement('div');
    messageContainer.style.cssText = `
        background: white !important;
        padding: 40px !important;
        border-radius: 12px !important;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        text-align: center !important;
        max-width: 500px !important;
        margin: 20px !important;
    `;
    
    // Create shield icon
    const icon = document.createElement('div');
    icon.innerHTML = '🛡️';
    icon.style.cssText = `
        font-size: 48px !important;
        margin-bottom: 20px !important;
    `;
    
    // Create message text
    const messageText = document.createElement('h2');
    messageText.textContent = message;
    messageText.style.cssText = `
        color: #333 !important;
        margin: 0 0 20px 0 !important;
        font-size: 24px !important;
        font-weight: 600 !important;
    `;
    
    // Create subtitle
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Content blocked by your safety filter';
    subtitle.style.cssText = `
        color: #666 !important;
        margin: 0 0 30px 0 !important;
        font-size: 16px !important;
    `;
    
    // Create back button
    const backButton = document.createElement('button');
    backButton.textContent = 'Go Back';
    backButton.style.cssText = `
        background: #667eea !important;
        color: white !important;
        border: none !important;
        padding: 12px 24px !important;
        border-radius: 6px !important;
        font-size: 16px !important;
        cursor: pointer !important;
        transition: background 0.3s !important;
        margin-right: 10px !important;
    `;
    
    // Create settings button
    const settingsButton = document.createElement('button');
    settingsButton.textContent = 'Settings';
    settingsButton.style.cssText = `
        background: #6c757d !important;
        color: white !important;
        border: none !important;
        padding: 12px 24px !important;
        border-radius: 6px !important;
        font-size: 16px !important;
        cursor: pointer !important;
        transition: background 0.3s !important;
    `;
    
    backButton.addEventListener('click', function() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = 'https://www.google.com';
        }
    });
    
    settingsButton.addEventListener('click', function() {
        chrome.runtime.openOptionsPage();
    });
    
    backButton.addEventListener('mouseenter', function() {
        this.style.background = '#5a67d8 !important';
    });
    
    backButton.addEventListener('mouseleave', function() {
        this.style.background = '#667eea !important';
    });
    
    settingsButton.addEventListener('mouseenter', function() {
        this.style.background = '#5a6268 !important';
    });
    
    settingsButton.addEventListener('mouseleave', function() {
        this.style.background = '#6c757d !important';
    });
    
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.appendChild(backButton);
    buttonContainer.appendChild(settingsButton);
    
    // Assemble the message
    messageContainer.appendChild(icon);
    messageContainer.appendChild(messageText);
    messageContainer.appendChild(subtitle);
    messageContainer.appendChild(buttonContainer);
    overlay.appendChild(messageContainer);
    
    // Add to page
    document.documentElement.appendChild(overlay);
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
}