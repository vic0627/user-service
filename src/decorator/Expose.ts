import { EXPOSE_MODULE } from "src/assets/TOKEN";
import { ClassDecorator } from "src/types/common.type";

/**
 * Define metadata that represents the target should be exposed to the IoC.
 * @param name Module name that wanted to register
 */
export default function Expose(name?: string): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(EXPOSE_MODULE, name ?? target.name, target);
    };
}
