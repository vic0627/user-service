import { Payload } from "src/types/ruleObject.type";
import { HttpResponse, RequestExecutor } from "src/types/xhr.type";
import type { CacheData } from "src/types/cacheManager.type";
import RequestObserver from "src/abstract/RequestObserver.abstract";
// import RequestError from "../requestHandler/RequestError";

export default class CacheManager implements RequestObserver {
  #heap = new Map<symbol, CacheData>();

  subscribe(requestToken: symbol, request: RequestExecutor, payload: Payload) {
    const decoratedRequest = async () => {
      if (this.#has(requestToken)) {
        const cache = this.#get(requestToken) as CacheData;

        if (this.#samePayload(payload, cache?.payload)) {
          return cache.res;
        }
      }

      const res = await request();

      if (typeof res === "object" && res !== null) {
        this.#set(requestToken, { res: res, payload });

        return res as HttpResponse;
      }

      throw new Error("Request failed");
    };

    return decoratedRequest;
  }

  #set(urlToken: symbol, requestInfo: CacheData) {
    this.#heap.set(urlToken, requestInfo);
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
