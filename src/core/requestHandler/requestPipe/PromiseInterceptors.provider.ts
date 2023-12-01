import type { RequestDetail, RequestExecutor } from "src/types/xhr.type";
import type { PromiseStageHooks } from "src/types/userService.type";
import type { InterceptorFrom } from "src/types/requestPipe.type";
import RequestError from "../RequestError";
import RequestPipe from "src/abstract/RequestPipe.abstract";
import { deepClone } from "src/utils/common";

/**
 * (pipe) Promise 階段的攔截器
 */
export default class PromiseInterceptors implements RequestPipe {
  chain({ request }: RequestDetail, interceptorsFrom: InterceptorFrom = {}): RequestExecutor {
    const interceptors = this.#getInterceptors(interceptorsFrom);

    return this.#injectInterceptors(request, interceptors);
  }

  /** 比較配置層級權重，返回要套用的攔截器 */
  #getInterceptors(interceptorsFrom: InterceptorFrom): PromiseStageHooks {
    const { serviceConfig = {}, apiRuntime = {} } = interceptorsFrom;

    const onRequest = apiRuntime.onRequest ?? serviceConfig.onRequest;
    const onRequestFailed = apiRuntime.onRequestFailed ?? serviceConfig.onRequestFailed;
    const onRequestSucceed = apiRuntime.onRequestSucceed ?? serviceConfig.onRequestSucceed;

    return { onRequest, onRequestFailed, onRequestSucceed };
  }

  /** 注入攔截器 */
  #injectInterceptors(request: RequestExecutor, interceptors: PromiseStageHooks) {
    const { onRequest, onRequestFailed, onRequestSucceed } = interceptors;

    // RequestExecutor 不再帶參數，將 onRequest 鎖定在這個 pipe 實現
    // 後續再傳任和東西進 RequestExecutor 都不會產生效果
    return (() => {
      const [response, abort] = request(onRequest);

      const promise = response
        .then((res) => {
          if (typeof onRequestSucceed === "function") {
            // 避免 client 直接從物件地址修改(in-place)，導致快取暫存到修改後的結果
            // ，因此一定要過一次深拷貝。
            const resCopy = deepClone(res);

            const resClient = onRequestSucceed(resCopy);

            return resClient ?? resCopy;
          }

          return res;
        })
        .catch((error) => {
          if (typeof onRequestFailed === "function") {
            onRequestFailed(error as RequestError);
          } else {
            throw error as RequestError;
          }
        });

      return [promise, abort];
    }) as RequestExecutor;
  }
}
