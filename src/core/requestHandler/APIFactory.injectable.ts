import type { RequestConfig } from "src/types/xhr.type";
import type { ApiConfig, FinalApiConfig, ParameterDeclaration, ServiceInterceptor } from "src/types/userService.type";
import XHR from "./XHR.provider";
import Injectable from "src/decorator/Injectable.decorator";
import RuleObject from "../validationEngine/RuleObject.injectable";
import { deepClone, resolveURL } from "src/utils/common";
import { Payload } from "src/types/ruleObject.type";
import RuleError from "../validationEngine/RuleError";
import CacheManager from "../cacheManager/CacheManager.provider";
import RequestHandler from "src/abstract/RequestHandler.abstract";
import PromiseInterceptors from "./PromiseInterceptors.provider";

@Injectable()
export default class APIFactory {
  #ajax?: RequestHandler;

  /**
   * 初始化網路請求 strategy
   */
  #useAjaxStrategy() {
    if (typeof XMLHttpRequest !== "undefined") {
      this.#ajax = this.xhr;
    }

    if (!this.#ajax) {
      throw new Error("User Service is only support in browser environment");
    }
  }

  constructor(
    private readonly ruleObject: RuleObject,
    private readonly xhr: XHR,
    private readonly cacheManager: CacheManager,
    private readonly promiseInterceptors: PromiseInterceptors,
  ) {
    this.#useAjaxStrategy();
  }

  createAPI(apiConfig?: ApiConfig, defaultConfig?: RequestConfig) {
    const copy = deepClone(defaultConfig) ?? {};
    const _copy = Object.assign(copy, apiConfig) as ApiConfig & RequestConfig;
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
      interceptor,
      url, // inherit 下來時，就已經組成完整的 url 了
    } = _copy;

    const payloadTester = this.ruleObject.evaluate(rules);

    return (payload: Payload = {}, requestConfig: FinalApiConfig = {}) => {
      const { interceptor = {} } = requestConfig;
      const { onBeforeValidation, onValidationFailed } = interceptor;

      try {
        if (typeof onBeforeValidation === "function") {
          onBeforeValidation(payload);
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

      const _url = this.#paramBuilder(url as string, payload, param, query);

      const ajax = this.#ajax?.request({
        url: _url,
        method,
        payload,
        auth,
        headers,
        headerMap,
        timeout: requestConfig?.timeout ?? timeout,
        timeoutErrorMessage,
        responseType,
      });

      if (!ajax) {
        throw new Error("Request failed");
      }

      const { requestToken, request, abortController, config } = ajax;

      let requestHandler = request;

      requestHandler = this.promiseInterceptors.subscribe(requestToken, request, {
        serviceConfig: _copy.interceptor,
        apiRuntime: interceptor,
      });

      if (requestConfig?.cache ?? cache) {
        requestHandler = this.cacheManager.subscribe(requestToken, requestHandler, payload);
      }

      return [requestHandler, abortController];
    };
  }

  #paramDeclarationDestructor(param?: ParameterDeclaration): [param: string[], description: string[]] {
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

  #paramBuilder(url: string, payload: Payload, param?: ParameterDeclaration, query?: ParameterDeclaration) {
    if (typeof payload !== "object" || payload === null) {
      return;
    }

    const [paramKeys, paramDescription] = this.#paramDeclarationDestructor(param);
    const [queryKeys, queryDescription] = this.#paramDeclarationDestructor(query);

    const builder = (o: string[], callback: (key: string, value: string | number) => void) => {
      o.forEach((key) => {
        if (!(key in payload)) {
          return;
        }

        const value = payload[key];

        if (typeof value !== "string" && typeof value !== "number") {
          console.warn("Parameter will skip the values that aren't in string or number type");

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

  #hasPromiseStageHooks(interceptor: ServiceInterceptor) {
    return "onRequest" in interceptor || "onRequestFailed" in interceptor || "onRequestSucceed" in interceptor;
  }
}
