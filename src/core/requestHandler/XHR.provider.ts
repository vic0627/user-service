import type {
    HeadersConfig,
    HttpAuthentication,
    PromiseExecutor,
    RequestConfig,
} from "src/types/xhr.type";
import { getRanNum, symbolToken } from "src/utils/common";

/**
 * # 處理請求的物件
 * 
 * > 注意：雖然是處理請求的地方，但所有方法皆為同步，唯一只有一個 Promise 物件 `requestObject`，需要透過它來取得請求結果。
 */
export default class XHR {
    #defaultConfig: RequestConfig = {};

    setDefaultConfig(config: RequestConfig) {
        this.#defaultConfig = config;
    }

    request(config: RequestConfig) {
        const {
            url = "",
            method = "GET",
            payload,
            headers,
            auth,
            timeout,
            responseType,
        } = config;
        const xhr = this.#init();

        /**
         * 這兩個參數預計後面規劃給 cache manager 使用
         */
        const { requestToken, tokenString } = this.#getRequestToken();

        const requestConfig = Object.assign(this.#defaultConfig, config);

        xhr.open(method, url, true);

        /**
         * 設置 xhr 的生命週期，返回：
         * 1. `requestObject` - Promise，想拿到 response 或 reject reason 要 await 它，不用再呼叫它。
         * 2. `abortController` - 取消請求控制器。
         */
        const { requestObject, abortController } = this.#httpHooksEncapsulation(
            xhr,
            requestConfig
        );

        this.#setTimeout(xhr, timeout);
        this.#setAuthentication(xhr, auth);
        this.#setRequestHeader(xhr, headers);
        this.#setResType(xhr, responseType);

        xhr.send((payload as XMLHttpRequestBodyInit) ?? null);

        return {
            requestToken,
            tokenString,
            requestObject,
            abortController,
            requestConfig,
        };
    }

    #init() {
        return new XMLHttpRequest();
    }

    #getRequestToken() {
        const tokenString =
            (getRanNum("string") as string).slice(2) +
            ":" +
            Date.now().toString();

        const requestToken = symbolToken(tokenString);

        return { requestToken, tokenString };
    }

    #setTimeout(xhr: XMLHttpRequest, t?: number) {
        const { timeout } = this.#defaultConfig;

        xhr.timeout = t ?? timeout ?? 0;
    }

    #setResType(xhr: XMLHttpRequest, resType?: XMLHttpRequestResponseType) {
        const { responseType } = this.#defaultConfig;

        xhr.responseType = resType ?? responseType ?? "";
    }

    #setRequestHeader(xhr: XMLHttpRequest, reqHeader?: HeadersConfig) {
        const { headers = {} } = this.#defaultConfig;
        const _headers = Object.assign(headers, reqHeader ?? {});

        for (const key in _headers) {
            if (!Object.prototype.hasOwnProperty.call(_headers, key)) continue;

            const value = _headers[key as keyof HeadersConfig] as string;

            xhr.setRequestHeader(key, value);
        }
    }

    #setAuthentication(xhr: XMLHttpRequest, a?: HttpAuthentication) {
        const auth = a ?? this.#defaultConfig.auth;

        if (!auth) return;

        const username = auth.username || "";
        const password = auth.password
            ? unescape(encodeURIComponent(auth.password))
            : "";

        xhr.setRequestHeader(
            "Authorization",
            "Basic " + btoa(username + ":" + password)
        );
    }

    #httpHooksEncapsulation(xhr: XMLHttpRequest, config: RequestConfig) {
        let abortController: () => void = () => {
            console.warn("Abort failed");
        };

        const requestObject = new Promise((resolve, reject) => {
            abortController = () => {
                xhr.abort();
                reject();
            };

            const executor = { resolve, reject, config };

            xhr.onloadend = this.#handlerFactory(
                xhr,
                executor,
                this.#handleLoadend
            );
            xhr.onabort = this.#handlerFactory(
                xhr,
                executor,
                this.#handleAbort
            );
            xhr.ontimeout = this.#handlerFactory(
                xhr,
                executor,
                this.#handleTimeout
            );
            xhr.onerror = this.#handlerFactory(
                xhr,
                executor,
                this.#handleError
            );
        });

        return { requestObject, abortController };
    }

    #handlerFactory(
        xhr: XMLHttpRequest,
        executor: PromiseExecutor,
        handler: (
            e: ProgressEvent | Event,
            xhr: XMLHttpRequest,
            executor: PromiseExecutor
        ) => void
    ) {
        return (e: ProgressEvent | Event) => handler(e, xhr, executor);
    }

    #handleAbort(
        _: ProgressEvent | Event,
        xhr: XMLHttpRequest,
        { reject }: PromiseExecutor
    ) {
        /** @todo */
        reject(xhr);
    }

    #handleTimeout(
        _: ProgressEvent | Event,
        xhr: XMLHttpRequest,
        { reject }: PromiseExecutor
    ) {
        /** @todo */
        reject(xhr);
    }

    #handleError(
        _: ProgressEvent | Event,
        xhr: XMLHttpRequest,
        { reject }: PromiseExecutor
    ) {
        /** @todo */
        reject(xhr);
    }

    #handleLoadend(
        _: ProgressEvent | Event,
        xhr: XMLHttpRequest,
        { resolve, config }: PromiseExecutor
    ) {
        const { responseType, response, responseText, status, statusText } =
            xhr;

        const data =
            !responseType || responseType === "text" || responseType === "json"
                ? responseText
                : response;

        const headers = xhr.getAllResponseHeaders();

        const res = {
            data,
            status,
            statusText,
            headers,
            config,
            request: xhr,
        };

        resolve(res);
    }
}
