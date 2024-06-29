/**
 * Useless version of `URL.createObjectURL`.
 * @param {Blob} blob 
 * @returns {Blob} 
 * @description background script won't be able to use blob url genarated in content scripts, just pass the blob to background script without convert it. 
 */
URL.createObjectURL = (blob) => blob;

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
 
// `GM.*` functions will return promies.
const GM = {
    download: (details) => {
        return new Promise((recolve, reject) => {
            GM_download({
                ...details,
                onload: () => {
                    recolve();
                    return details.onload;
                }
            })
        })
    }
}

function GM_xmlhttpRequest(details) {
    let abort = false;

    const eventCb = (fn, arg) => {
        if (fn && !abort) setTimeout(() => fn(arg), 1);
    };

    const load = (res) => {
        eventCb(details["onload"], res);
    };
    const readystatechange = (res) => {
        eventCb(details["onreadystatechange"], res);
    };
    const error = (res) => {
        eventCb(details["onerror"], res);
    }

    xmlHttpRequest(details, load, readystatechange, error);

    return { abort: () => { abort = true; } };
}

function GM_download(details) {
    const {
        url,
        name: filename,
        saveAs,
        onload,
        onreadystatechange,
        onerror
    } = details; 
    let abort = false;

    const eventCb = (fn, arg) => {
        if (fn && !abort) setTimeout(() => fn(arg), 1);
    };

    const load = (res) => {
        eventCb(onload, res);
    };
    const readystatechange = (res) => {
        eventCb(onreadystatechange, res);
    };
    const error = (res) => {
        eventCb(onerror, res);
    }

    chrome.runtime.sendMessage({ get: 'download', options: { url, filename, saveAs } })
        .then(load);
    
    return { abort: () => { abort = true; } };
}

function xmlHttpRequest(details, callback, onreadychange, onerr, done, internal) {
    const xmlhttp = new XMLHttpRequest();

    const createState = () => {
        const o = {
            readyState: xmlhttp.readyState,
            responseHeaders: xmlhttp.getAllResponseHeaders(),
            finalUrl: details.url, // not actual final url.
            status: (xmlhttp.readyState == 4 ? xmlhttp.status : 0),
            statusText: (xmlhttp.readyState == 4 ? xmlhttp.statusText : '')
        };
        if (xmlhttp.readyState == 4) {
            if (!xmlhttp.responseType || xmlhttp.responseType == '') {
                o.responseXML = (xmlhttp.responseXML ? escape(xmlhttp.responseXML) : null);
                o.responseText = xmlhttp.responseText;
                o.response = xmlhttp.response;
            } else {
                o.responseXML = null;
                o.responseText = null;
                o.response = xmlhttp.response;
            }
        } else {
            o.responseXML = null;
            o.responseText = '';
            o.response = null;
        }
        return o;
    };

    xmlhttp.onload = () => {
        const responseState = createState();
        if (responseState.readyState == 4 &&
            responseState.status != 200 &&
            responseState.status != 0 &&
            details.retries > 0) {
            details.retries--;
            xmlHttpRequest(details, callback, onreadychange, onerr, done, internal);
            return;
        }
        if (callback) callback(responseState);
        if (done) done();
    };
    xmlhttp.onerror = () => {
        const responseState = createState();
        if (responseState.readyState == 4 &&
            responseState.status != 200 &&
            responseState.status != 0 &&
            details.retries > 0) {
            details.retries--;
            xmlHttpRequest(details, callback, onreadychange, onerr, done, internal);
            return;
        }
        if (onerr) {
            onerr(responseState);
        } else if (callback) {
            callback(responseState);
        }
        if (done) done();
        delete xmlhttp;
    };
    xmlhttp.onreadystatechange = (c) => {
        const responseState = createState();
        if (onreadychange) {
            try {
                if (c.lengthComputable || c.totalSize > 0 ) {
                    responseState.progress = { total: c.total,  totalSize: c.totalSize };
                } else {
                    var t = Number(Helper.getStringBetweenTags(responseState.responseHeaders, 'Content-Length:', '\n').trim());
                    var l = xmlhttp.responseText ? xmlhttp.responseText.length : 0;
                    if (t > 0) {
                        responseState.progress = { total: l,  totalSize: t };
                    }
                }
            } catch (e) {}
            onreadychange(responseState);
        }
    };

    try {
        xmlhttp.open(details.method, details.url);

        if (details.headers) {
            for (const prop in details.headers) {
                let p = prop;
                if (_webRequest.use && (prop.toLowerCase() == "user-agent" || prop.toLowerCase() == "referer"))  {
                    p = _webRequest.prefix + prop;
                }
                xmlhttp.setRequestHeader(p, details.headers[prop]);
            }
        }
        if (typeof(details.overrideMimeType) !== 'undefined') {
            xmlhttp.overrideMimeType(details.overrideMimeType);
        }
        if (typeof(details.responseType) !== 'undefined') {
            xmlhttp.responseType = details.responseType;
        }
        if (typeof(details.data) !== 'undefined') {
            xmlhttp.send(details.data);
        } else {
            xmlhttp.send();
        }
    } catch(e) {
        console.log("xhr: error: " + e.message);
        if(callback) {
            var resp = { responseXML: '',
                         responseText: '',
                         response: null,
                         readyState: 4,
                         responseHeaders: '',
                         status: 403,
                         statusText: 'Forbidden'};
            callback(resp);
        }
        if (done) done();
    }
};