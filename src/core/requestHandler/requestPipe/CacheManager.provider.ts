import type {
  HttpResponse,
  PromiseExecutor,
  RequestDetail,
  RequestExecutor,
  RequestExecutorResult,
} from "src/types/xhr.type";
import type { Payload } from "src/types/ruleObject.type";
import type { CacheData } from "src/types/requestPipe.type";
import RequestPipe from "src/abstract/RequestPipe.abstract";

/**
 * (pipe) 快取管理
 * @todo 增加快取壽命機制
 */
export default class CacheManager implements RequestPipe {
  /** 暫存空間 */
  #heap = new Map<symbol, CacheData>();

  chain({ requestToken, request, executor }: RequestDetail, payload: Payload) {
    return ((onRequest) => {
      // 如果當前被呼叫的 API 存在暫存結果，就比較前後參數
      // 如果前後兩次參數相同，就返回暫存數據，直到參數不同

      /** 暫存結果 */
      const cache = this.#cache({ requestToken, payload, executor });

      if (cache) {
        return cache as RequestExecutorResult;
      }

      const [response, abort] = request(onRequest);

      // 利用 Promise chaining 實現 middeware
      const _request = response.then((res) => this.#chainingCallback({ requestToken, res, executor, payload }));

      return [_request, abort];
    }) as RequestExecutor;
  }

  /** 比較 payload 參數並返回暫存結果 */
  #cache(options: { requestToken: symbol; payload: Payload; executor: PromiseExecutor }) {
    const { requestToken, payload, executor } = options;

    if (!this.#has(requestToken)) {
      return;
    }

    const cache = this.#get(requestToken) as CacheData;

    if (this.#samePayload(payload, cache?.payload)) {
      // xhr 已建立，但沒 send，此時的 resolve 只是 xhr 的清除函式
      // 一但偵測到快取，就不會有 Promise，這裡一定要清除 xhr！
      executor.resolve(cache.res);

      const abort = () => {
        console.warn("failed to abort request from cache manager");
      };

      const cacheRes = new Promise<HttpResponse | void>((resolve) => resolve(cache.res));

      return [cacheRes, abort];
    }
  }

  /** 寫入/更新快取並返回請求結果 */
  #chainingCallback(options: {
    requestToken: symbol;
    payload: Payload;
    res: HttpResponse | void;
    executor: PromiseExecutor;
  }) {
    const { requestToken, payload, res, executor } = options;

    if (typeof res === "object" && res !== null) {
      this.#set(requestToken, { res, payload });

      return res as HttpResponse;
    }

    const rejectReason = "Request failed";
    executor.reject(rejectReason);

    throw new Error(rejectReason);
  }

  #set(requestToken: symbol, cacheData: CacheData) {
    this.#heap.set(requestToken, cacheData);
  }

  #has(requestToken: symbol) {
    return this.#heap.has(requestToken);
  }

  #get(requestToken: symbol) {
    return this.#heap.get(requestToken);
  }

  #samePayload<T extends Payload>(obj1: T, obj2: T) {
    if (typeof obj1 !== typeof obj2) {
      return false;
    }

    if (typeof obj1 === "object") {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      if (keys1.length !== keys2.length) {
        return false;
      }

      for (const key of keys1) {
        if (!this.#samePayload(obj1[key] as T, obj2[key] as T)) {
          return false;
        }
      }

      return true;
    }

    return obj1 === obj2;
  }
}
