import { ClassSignature } from "./common.type";

export interface IOCOptions {
    provides?: ClassSignature[];
    imports?: ClassSignature[];
}
