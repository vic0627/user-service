import { HttpResponse } from "src/types/xhr.type";

export default class CacheManager {
    #heap = new Map<symbol, HttpResponse>();

    set(urlToken: symbol, res: HttpResponse) {
        this.#heap.set(urlToken, res);
    }
}
