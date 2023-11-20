const blankFn = (hook) => {
    return (e, xhr) => {
        console.log({ hook, e });
        if (hook === "") xhr.abort();
    };
};

const xhr = (config) => {
    const {
        url,
        method = "GET",
        header = {},
        timeout = 300000,
        responseType = "",
        payload = null,
        onLoadstart = blankFn("onLoadstart"),
        onReadystatechange = blankFn("onReadystatechange"),
        onProgress = blankFn("onProgress"),
        onLoad = blankFn("onLoad"),
        onLoadend = blankFn("onLoadend"),
        onError = blankFn("onError"),
        onTimeout = blankFn("onTimeout"),
        onAbort = blankFn("onAbort"),
    } = config;

    return new Promise((resolve, reject) => {
        const x = new XMLHttpRequest();

        x.open(method, url);

        x.timeout = timeout;
        x.responseType = responseType;

        for (const key in header) {
            const val = header[key];

            x.setRequestHeader(key, val);
        }

        x.onabort = (e) => onAbort(e, x);
        x.onerror = (e) => onError(e, x);
        x.onload = (e) => onLoad(e, x);
        x.onloadend = (e) => onLoadend(e, x);
        x.onloadstart = (e) => onLoadstart(e, x);
        x.onprogress = (e) => onProgress(e, x);
        x.onreadystatechange = (e) => onReadystatechange(e, x);
        x.ontimeout = (e) => onTimeout(e, x);

        x.send(payload);
    });
};
