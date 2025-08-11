document.addEventListener('DOMContentLoaded', function () {
    loadSettings();
    setupEventListeners();
});

function setupEventListeners() {
    // Blocking method dropdown change
    document.getElementById('blockingMethod').addEventListener('change', function () {
        toggleSections(this.value);
    });

    // Save button
    document.getElementById('saveBtn').addEventListener('click', saveSettings);
}

function toggleSections(method) {
    const redirectSection = document.getElementById('redirectSection');
    const messageSection = document.getElementById('messageSection');

    if (method === 'redirect') {
        redirectSection.classList.remove('hidden');
        messageSection.classList.add('hidden');
    } else {
        redirectSection.classList.add('hidden');
        messageSection.classList.remove('hidden');
    }
}

function loadSettings() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get([
            'blockingMethod',
            'redirectUrl',
            'customMessage',
            'blockedLinks'
        ], function (result) {
            // Set blocking method
            const method = result.blockingMethod || 'redirect';
            document.getElementById('blockingMethod').value = method;
            toggleSections(method);

            // Set redirect URL
            document.getElementById('redirectUrl').value =
                result.redirectUrl || 'https://www.google.com';

            // Set custom message
            document.getElementById('customMessage').value =
                result.customMessage || 'This content has been blocked by your safety filter.';

            // Load blocked links
            const blockedLinks = result.blockedLinks || [];
            document.getElementById('blockedLinks').value = blockedLinks.join('\n');
        });
    } else {
        // Fallback for testing outside extension
        console.log('Chrome extension API not available - using defaults');
        document.getElementById('redirectUrl').value = 'https://www.google.com';
        document.getElementById('customMessage').value = 'This content has been blocked by your safety filter.';
        toggleSections('redirect');
    }
}

function saveSettings() {
    // Get blocked links from textarea and convert to array
    const blockedLinksText = document.getElementById('blockedLinks').value;
    const blockedLinksArray = blockedLinksText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const settings = {
        blockingMethod: document.getElementById('blockingMethod').value,
        redirectUrl: document.getElementById('redirectUrl').value || 'https://www.google.com',
        customMessage: document.getElementById('customMessage').value || 'This content has been blocked by your safety filter.',
        blockedLinks: blockedLinksArray
    };

    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set(settings, function () {
            if (chrome.runtime.lastError) {
                showStatus('Error saving settings: ' + chrome.runtime.lastError.message, 'error');
            } else {
                showStatus('Settings saved successfully!', 'success');
            }
        });
    } else {
        // Fallback for testing
        console.log('Settings would be saved:', settings);
        showStatus('Settings saved successfully! (Demo mode)', 'success');
    }
}

function showStatus(message, type) {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `status-message status-${type}`;
    statusEl.style.display = 'block';

    setTimeout(() => {
        statusEl.style.display = 'none';
    }, 3000);
}