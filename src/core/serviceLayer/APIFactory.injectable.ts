import type { RequestConfig } from "src/types/xhr.type";
import type {
    ApiConfig,
    ParameterDeclaration,
} from "src/types/userService.type";
import XHR from "../requestHandler/XHR.provider";
import Injectable from "src/decorator/Injectable.decorator";
import RuleObject from "../validationEngine/RuleObject.injectable";
import { deepClone, resolveURL } from "src/utils/common";
import { Payload } from "src/types/ruleObject.type";

@Injectable()
export default class APIFactory {
    #ajax?: XHR;

    #useAjaxStrategy() {
        if (typeof XMLHttpRequest !== "undefined") this.#ajax = this.xhr;

        if (!this.#ajax)
            throw new Error(
                "User Service is only support in browser environment"
            );
    }

    constructor(
        private readonly ruleObject: RuleObject,
        private readonly xhr: XHR
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

        // this.#ajax?.request({
        //     url,
        //     method,
        //     auth,
        //     headers,
        //     headerMap,
        //     timeout,
        //     timeoutErrorMessage,
        //     responseType,
        // });

        return (payload: Payload) => {
            if (validation) payloadTester(payload);

            return this.#paramBuilder(url as string, payload, param, query);
        };
    }

    #paramDeclarationDestructor(param?: ParameterDeclaration) {
        if (!param) return [[], []];

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
        if (typeof payload !== "object" || payload === null) return;

        const [paramKeys, paramDescription] =
            this.#paramDeclarationDestructor(param);
        const [queryKeys, queryDescription] =
            this.#paramDeclarationDestructor(query);

        const builder = (
            o: string[],
            callback: (key: string, value: string | number) => void
        ) => {
            o.forEach((key) => {
                if (!(key in payload)) return;

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
