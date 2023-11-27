import type { RequestConfig } from "src/types/xhr.type";
import type {
    ApiConfig,
    FinalApiConfig,
    ParameterDeclaration,
} from "src/types/userService.type";
import XHR from "../requestHandler/XHR.provider";
import Injectable from "src/decorator/Injectable.decorator";
import RuleObject from "../validationEngine/RuleObject.injectable";
import { deepClone, resolveURL } from "src/utils/common";
import { Payload } from "src/types/ruleObject.type";
import RuleError from "../validationEngine/RuleError";
import CacheManager from "../cacheManager/CacheManager.provider";

@Injectable()
export default class APIFactory {
    #ajax?: XHR;

    /**
     * 初始化網路請求 strategy
     */
    #useAjaxStrategy() {
        if (typeof XMLHttpRequest !== "undefined") {
            this.#ajax = this.xhr;
        }

        if (!this.#ajax) {
            throw new Error(
                "User Service is only support in browser environment"
            );
        }
    }

    constructor(
        private readonly ruleObject: RuleObject,
        private readonly xhr: XHR,
        private readonly cacheManager: CacheManager
    ) {
        this.#useAjaxStrategy();
    }

    createAPI(apiConfig?: ApiConfig, defaultConfig?: RequestConfig) {
        const copy = deepClone(defaultConfig) ?? {};
        const _copy = Object.assign(copy, apiConfig) as ApiConfig &
            RequestConfig;
        const {
            auth,
            headers,
            timeout,
            timeoutErrorMessage,
            responseType,
            headerMap,
            method,
            query,
            param,
            rules,
            validation,
            cache,
            url,
        } = _copy;

        const payloadTester = this.ruleObject.evaluate(rules);

        return (payload: Payload = {}, requestConfig: FinalApiConfig = {}) => {
            const { interceptors = {} } = requestConfig;
            const { onBeforeValidation, onValidationFailed } = interceptors;

            try {
                if (typeof onBeforeValidation === "function") {
                    onBeforeValidation(payload, rules);
                }

                if (validation) {
                    payloadTester(payload);
                }
            } catch (error) {
                if (typeof onValidationFailed === "function") {
                    onValidationFailed(error as RuleError);
                } else {
                    console.error(error);
                }

                return [() => {}, () => {}];
            }

            const _url = this.#paramBuilder(
                url as string,
                payload,
                param,
                query
            );

            const ajax = this.#ajax?.request({
                url: _url,
                method,
                payload,
                auth,
                headers,
                headerMap,
                timeout,
                timeoutErrorMessage,
                responseType,
            });

            if (!ajax) {
                throw new Error("Request failed");
            }

            const { requestToken, request, abortController, config } = ajax;

            let requestHandler = request;

            if (requestConfig?.cache ?? cache) {
                requestHandler = this.cacheManager.subscribe(
                    requestToken,
                    request,
                    payload
                );
            }

            return [requestHandler, abortController];
        };
    }

    #paramDeclarationDestructor(
        param?: ParameterDeclaration
    ): [param: string[], description: string[]] {
        if (!param) {
            return [[], []];
        }

        const isArray = Array.isArray(param);

        if (isArray) {
            return [param, []];
        } else {
            const keys: string[] = [];
            const description: string[] = [];

            Object.entries(param).forEach(([key, value]) => {
                keys.push(key);
                description.push(value);
            });

            return [keys, description];
        }
    }

    #paramBuilder(
        url: string,
        payload: Payload,
        param?: ParameterDeclaration,
        query?: ParameterDeclaration
    ) {
        if (typeof payload !== "object" || payload === null) {
            return;
        }

        const [paramKeys, paramDescription] =
            this.#paramDeclarationDestructor(param);
        const [queryKeys, queryDescription] =
            this.#paramDeclarationDestructor(query);

        const builder = (
            o: string[],
            callback: (key: string, value: string | number) => void
        ) => {
            o.forEach((key) => {
                if (!(key in payload)) {
                    return;
                }

                const value = payload[key];

                if (typeof value !== "string" && typeof value !== "number") {
                    console.warn(
                        "Parameter will skip the values that aren't in string or number type"
                    );

                    return;
                }

                callback(key, value);
            });
        };

        const _param: (string | number)[] = [];
        builder(paramKeys, (_, value) => {
            _param.push(value);
        });

        const _query: Record<string, string | number> = {};
        builder(queryKeys, (key, value) => {
            _query[key] = value;
        });

        return resolveURL([url, ..._param], _query);
    }
}
