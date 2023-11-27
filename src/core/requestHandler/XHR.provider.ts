import type {
    HeadersConfig,
    HttpAuthentication,
    HttpResponse,
    PromiseExecutor,
    RequestConfig,
} from "src/types/xhr.type";
import { symbolToken } from "src/utils/common";
import RequestHandler from "src/abstract/RequestHandler.abstract";
import RequestError from "./RequestError";

/**
 * # 處理請求的物件
 *
 * > 注意：雖然是處理請求的地方，但所有方法皆為同步，唯一只有一個 Promise 物件 `requestObject`，需要透過它來取得請求結果。
 */
export default class XHR implements RequestHandler {
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

        let xhr: XMLHttpRequest | null = new XMLHttpRequest();

        /** 釋放 xhr 記憶體 */
        const cleanup = () => {
            xhr = null;
        };

        const _method = method.toUpperCase();

        const requestToken = symbolToken(_method + ":" + url);

        xhr.open(_method, url, true);

        /**
         * 設置 xhr 的生命週期，返回：
         * 1. `requestObject` - Promise，想拿到 response 或 reject reason 要 await 它，不用再呼叫它。
         * 2. `abortController` - 取消請求控制器。
         */
        const { requestObject, abortController } = this.#httpHooksEncapsulation(
            xhr,
            cleanup,
            config
        );

        this.#setTimeout(xhr, timeout);
        this.#setAuthentication(xhr, auth);
        this.#setRequestHeader(xhr, headers);
        this.#setResType(xhr, responseType);

        const request = () => {
            if (xhr) {
                xhr.send((payload as XMLHttpRequestBodyInit) ?? null);
            }

            return requestObject;
        };

        return {
            requestToken,
            request,
            abortController,
            config,
        };
    }

    //#region private methods
    #setTimeout(xhr: XMLHttpRequest, t?: number) {
        xhr.timeout = t ?? 0;
    }

    #setResType(xhr: XMLHttpRequest, resType?: XMLHttpRequestResponseType) {
        xhr.responseType = resType ?? "";
    }

    #setRequestHeader(xhr: XMLHttpRequest, reqHeader?: HeadersConfig) {
        const _headers = reqHeader ?? {};

        for (const key in _headers) {
            if (!Object.prototype.hasOwnProperty.call(_headers, key)) {
                continue;
            }

            const value = _headers[key as keyof HeadersConfig] as string;

            xhr.setRequestHeader(key, value);
        }
    }

    #setAuthentication(xhr: XMLHttpRequest, a?: HttpAuthentication) {
        const auth = a ?? ({} as HttpAuthentication);

        if (!auth) {
            return;
        }

        const username = auth?.username || "";
        const password = auth?.password
            ? decodeURIComponent(encodeURIComponent(auth.password))
            : "";

        xhr.setRequestHeader(
            "Authorization",
            "Basic " + btoa(username + ":" + password)
        );
    }

    #httpHooksEncapsulation(
        xhr: XMLHttpRequest,
        cleanup: () => void,
        config: RequestConfig
    ) {
        let abortController: () => void = () => {
            console.warn("Abort failed");
        };

        const requestObject = new Promise<HttpResponse>((_resolve, _reject) => {
            const resolve = (value: HttpResponse) => {
                cleanup();
                _resolve(value);
            };

            const reject = (reason?: unknown) => {
                cleanup();

                /** @todo 在發出請求前使用 abortController 會有 Uncaught Error 出現 */
                _reject(reason);
            };

            abortController = (reason?: unknown) => {
                if (!xhr) {
                    return;
                }

                xhr.abort();
                reject(reason);
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
        return (e: ProgressEvent | Event) =>
            handler.call(this, e, xhr, executor);
    }

    #handleAbort(
        _: ProgressEvent | Event,
        xhr: XMLHttpRequest,
        { reject }: PromiseExecutor
    ) {
        if (!xhr) {
            return;
        }

        reject(new RequestError("Request aborted"));
    }

    #handleTimeout(
        _: ProgressEvent | Event,
        xhr: XMLHttpRequest,
        { reject, config }: PromiseExecutor
    ) {
        if (!xhr) {
            return;
        }

        const { timeout, timeoutErrorMessage } = config ?? {};

        let errMsg = timeoutErrorMessage;
        errMsg ??= timeout
            ? `time of ${timeout}ms exceeded`
            : "timeout exceeded";

        reject(new RequestError(errMsg));
    }

    #handleError(
        _: ProgressEvent | Event,
        xhr: XMLHttpRequest,
        { reject, config }: PromiseExecutor
    ) {
        if (!xhr) {
            return;
        }

        const { url } = config ?? {};
        const { status } = xhr;

        reject(new RequestError(`Network Error ${url} ${status}`));
    }

    #handleLoadend(
        _: ProgressEvent | Event,
        xhr: XMLHttpRequest,
        { resolve, config }: PromiseExecutor
    ) {
        if (!xhr) {
            return;
        }

        const { responseType, response, responseText, status, statusText } =
            xhr;

        const data =
            !responseType || responseType === "text" || responseType === "json"
                ? responseText
                : response;

        let headers: string | Record<string, string> =
            xhr.getAllResponseHeaders();

        if (typeof headers === "string" && config?.headerMap) {
            headers = this.#getHeaderMap(headers);
        }

        const res: HttpResponse = {
            data,
            status,
            statusText,
            headers,
            config,
            request: xhr,
        };

        resolve(res);
    }

    #getHeaderMap(headers: string) {
        const arr = headers.trim().split(/[\r\n]+/);

        const headerMap: Record<string, string> = {};

        arr.forEach((line) => {
            const parts = line.split(": ");
            const header = parts.shift();
            const value = parts.join(": ");

            if (header) {
                Object.defineProperty(headerMap, header, { value });
            }
        });

        return headerMap;
    }
    //#endregion
}
