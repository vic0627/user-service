import type { RequestConfig } from "src/types/xhr.type";
import type { ApiConfig } from "src/types/userService.type";
import XHR from "../requestHandler/XHR.provider";
import Injectable from "src/decorator/Injectable.decorator";
import RuleObject from "../validationEngine/RuleObject.injectable";

@Injectable()
export default class APIFactory {
    #ajax?: XHR;

    #setAJAX() {
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
        this.#setAJAX();
    }

    createAPI(apiConfig: ApiConfig, defaultConfig: RequestConfig) {
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
        } = apiConfig;

        const payloadTester = this.ruleObject.evaluate(rules);

        return () => {};
    }
}
