// replace unsafeWindow
/** @type {Promise<{ csrfToken: string }>} */
const unsafeWindow = genUnsafeWindow();
function genUnsafeWindow() {
    return new Promise((reslove, reject) => {
        chrome.runtime.sendMessage({ get: 'xhrRequestHeader' })
            .then(csrfToken => {
                unsafeWindow.csrfToken = csrfToken;
                reslove();
            });
    })
};
 
