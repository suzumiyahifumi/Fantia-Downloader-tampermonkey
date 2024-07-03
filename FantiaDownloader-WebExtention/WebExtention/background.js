// recive message form content scripts.
chrome.runtime.onMessage.addListener((msg, sender, sendRes) => {
    console.log('recive msg: ', msg)
    if (msg.get === 'xhrRequestHeader') {
        chrome.storage.session.get('csrfToken')
            .then(({ csrfToken }) => sendRes(csrfToken))
            .catch(console.error);
        return true;
    }
    if (msg.get === 'download') {
        download(msg.options)
            .then(sendRes)
            .catch(console.error);
        return true;
    }
    return false;
});

// Catch xhr request header from fantia's API.
 chrome.webRequest.onBeforeSendHeaders.addListener(
    (req) => {
        for (const header of req.requestHeaders) {
            if (header.name.toLowerCase() === "x-csrf-token") {
                chrome.storage.session.set({ csrfToken: header.value });
                console.info('csrfToken updated');
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

function download({ url: data, filename, saveAs = false }) {
    return new Promise((resolve, reject) => {
        const isBlob = data instanceof Blob;
        const url = isBlob ? URL.createObjectURL(data) : data;
        chrome.downloads.download({
                url,
                filename,
                saveAs
            })
            .then(resolve)
            .catch(reject)
            .finally(() => {
                if (isBlob) setTimeout(() => URL.revokeObjectURL(url), 1000);
            });
    });
}
