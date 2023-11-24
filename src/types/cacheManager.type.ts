import { Payload } from "./ruleObject.type";
import { HttpResponse } from "./xhr.type";

export interface CacheData {
    res: HttpResponse;
    payload: Payload;
}
