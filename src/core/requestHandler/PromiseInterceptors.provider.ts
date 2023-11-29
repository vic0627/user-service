import RequestObserver from "src/abstract/RequestObserver.abstract";
import { PromiseStageHooks, ServiceInterceptor } from "src/types/userService.type";
import { HttpResponse, RequestExecutor } from "src/types/xhr.type";
import RequestError from "./RequestError";

export default class PromiseInterceptors implements RequestObserver {
  subscribe(
    _: symbol,
    request: RequestExecutor,
    interceptorsFrom: { serviceConfig?: ServiceInterceptor; apiRuntime?: ServiceInterceptor } = {},
  ): RequestExecutor {
    const interceptors = this.#getInterceptors(interceptorsFrom);

    const _request = this.#implementLifeCycle(request, interceptors);

    return _request;
  }

  #getInterceptors(interceptorsFrom: {
    serviceConfig?: ServiceInterceptor;
    apiRuntime?: ServiceInterceptor;
  }): PromiseStageHooks {
    const { serviceConfig = {}, apiRuntime = {} } = interceptorsFrom;

    const onRequest = serviceConfig.onRequest ?? apiRuntime.onRequest;
    const onRequestFailed = serviceConfig.onRequestFailed ?? apiRuntime.onRequestFailed;
    const onRequestSucceed = serviceConfig.onRequestSucceed ?? apiRuntime.onRequestSucceed;

    return { onRequest, onRequestFailed, onRequestSucceed };
  }

  #implementLifeCycle(request: RequestExecutor, interceptors: PromiseStageHooks) {
    const { onRequest, onRequestFailed, onRequestSucceed } = interceptors;

    /**
     * @todo onRequest 攔截器
     */

    return async () => {
      try {
        const res = await request();

        if (typeof onRequestSucceed === "function") {
          const _res = onRequestSucceed(res);

          return (_res as HttpResponse) ?? res;
        }

        return res;
      } catch (error) {
        if (typeof onRequestFailed === "function") {
          onRequestFailed(error as RequestError);
        } else {
          throw error as RequestError;
        }
      }
    };
  }
}
