import type {
  FinalApiConfig,
  InheritConfig,
  ParamDef,
  ServiceApiConfig,
  ServiceInterceptor,
} from "src/types/userService.type";
import type { RequestConfig } from "src/types/xhr.type";
import type { Payload } from "src/types/ruleObject.type";
import XHR from "./requestStrategy/XHR.provider";
import Injectable from "src/decorator/Injectable.decorator";
import RuleObject from "../validationEngine/RuleObject.injectable";
import { deepClone, resolveURL } from "src/utils/common";
import RuleError from "../validationEngine/RuleError";
import CacheManager from "./requestPipe/CacheManager.provider";
import RequestHandler from "src/abstract/RequestHandler.abstract";
import PromiseInterceptors from "./requestPipe/PromiseInterceptors.provider";
import ScheduledTask from "../scheduledTask/ScheduledTask.provider";

/**
 * @todo 功能細部拆分，秉持單一職責
 * @todo 配置的繼承，Service Factory 只處理到 Service 節點的繼承，這裡要實現 API 節點與 Final API Config 配置的繼承
 */
@Injectable()
export default class APIFactory {
  /** 網路請求策略，依賴抽象 */
  #ajax?: RequestHandler;

  /** 初始化網路請求 strategy */
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
    private readonly schduledTask: ScheduledTask,
  ) {
    this.#useAjaxStrategy();
  }

  createAPI(apiConfig?: ServiceApiConfig, inheritConfig?: InheritConfig | RequestConfig) {
    const copy = this.#mergeConfig(inheritConfig, apiConfig) as ServiceApiConfig & RequestConfig;

    const payloadTester = this.ruleObject.evaluate(copy.rules);

    return (payload: Payload = {}, requestConfig: FinalApiConfig = {}) => {
      const runtimeOverWrite = this.#mergeConfig(copy, requestConfig) as ServiceApiConfig &
        RequestConfig &
        FinalApiConfig;

      const {
        interceptor = {},
        method,
        auth,
        headerMap,
        headers,
        timeout,
        timeoutErrorMessage,
        responseType,
        param,
        query,
        body,
        validation,
        cache,
        cacheLifetime,
      } = runtimeOverWrite;

      // console.log(runtimeOverWrite);

      const { onBeforeBuildingURL, onBeforeRequest } = interceptor;

      const exam = this.#validationEngine({
        validation,
        payload,
        payloadTester,
        interceptor,
      });

      if (exam) {
        return exam;
      }

      const paramDef = {
        param,
        query,
        body,
      };

      if (typeof onBeforeBuildingURL === "function") {
        onBeforeBuildingURL(payload, paramDef);
      }

      let url = runtimeOverWrite.url;
      url = this.#paramBuilder(url as string, payload, param, query);

      if (typeof onBeforeRequest === "function") {
        onBeforeRequest(payload, paramDef);
      }

      const ajax = this.#ajax?.request({
        url,
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

      const { request } = ajax;

      let requestHandler = request;

      if (cache) {
        requestHandler = this.cacheManager.chain(ajax, payload, cacheLifetime);

        this.schduledTask.addSingletonTask("cache", this.cacheManager.schduledTask.bind(this.cacheManager));

        ajax.request = requestHandler;
      }

      requestHandler = this.promiseInterceptors.chain(ajax, {
        serviceConfig: copy.interceptor,
        apiRuntime: interceptor,
      });

      return requestHandler();
    };
  }

  #mergeConfig<T, K>(mainConfig?: T, viceConfig?: K) {
    const copy = deepClone(mainConfig) ?? {};
    return Object.assign(copy, viceConfig);
  }

  #paramDeclarationDestructor(param?: ParamDef): [param: string[], description: string[]] {
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

  #paramBuilder(url: string, payload: Payload, param?: ParamDef, query?: ParamDef) {
    if (typeof payload !== "object" || payload === null) {
      return;
    }

    const [paramKeys] = this.#paramDeclarationDestructor(param);
    const [queryKeys] = this.#paramDeclarationDestructor(query);

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

  #validationEngine(options: {
    validation?: boolean;
    payload: Payload;
    payloadTester: (payload: Payload) => void;
    interceptor: ServiceInterceptor;
  }) {
    const { validation, payload, payloadTester, interceptor } = options;
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

      return [{}, () => {}];
    }
  }
}
