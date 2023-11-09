import { ClassSignature } from "src/types/common.type";

/**
 * Redefine all dependencies that are needed of the target.
 * Only the module which is decorated by this function can be injected correctly.
 */
export default function Injectable(): ClassDecorator {
    return (target) => {
        const deps = (Reflect.getMetadata("design:paramtypes", target) ??
            []) as ClassSignature[];

        Reflect.defineMetadata("design:paramtypes", deps, target);
    };
}
