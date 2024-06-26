const csrfToken = getCSRF();

// recive message form content scripts.
chrome.runtime.onMessage.addListener((msg, sender, sendRes) => {
    if (msg.get === 'xhrRequestHeader') {
        return Promise.resolve(csrfToken);
    }
    return false;
});

function getCSRF() {
    return new Promise((resolve, reject) => {
        // Catch xhr request header from fantia's API.
        chrome.webRequest.onBeforeSendHeaders.addListener(
            (req) => {
                for (const header of req.requestHeaders) {
                    if (header.name.toLowerCase() === "x-csrf-token") {
                        resolve(header.value);
                    }
                }
            },
            {
                urls: [
                    'https://fantia.jp/api/v1/fanclub/backnumbers/monthly_contents/*',
                    'https://fantia.jp/api/v1/posts/*'
                ]
            },
            ["requestHeaders"]
        )
    })
}

