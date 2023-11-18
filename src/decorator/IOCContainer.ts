import type { ClassDecorator, ClassSignature } from "src/types/common.type";
import type { Provider, Importer } from "src/types/ioc.type";
import type { IOCOptions } from "src/types/decorator.type";
import { META_PARAMTYPES, META_EXPOSE } from "src/assets/METADATA";

/**
 * Inversion of control container
 * @param options
 */
export default function IOCContainer(options: IOCOptions = {}): ClassDecorator {
    const { provides, imports } = options;

    return (target) => {
        /**
         *
         */
        const providers = (provides?.map((slice: ClassSignature) => [
            Symbol.for(slice.toString()),
            new slice(),
        ]) ?? []) as Provider[];

        /**
         *
         */
        const importers = (imports?.map((slice) => {
            const token = Symbol.for(slice.toString());

            const deps = (Reflect.getMetadata(META_PARAMTYPES, slice) ??
                []) as ClassSignature[];

            const requirements = deps.map((dep: ClassSignature) =>
                Symbol.for(dep.toString())
            );

            return [
                token,
                {
                    constructor: slice,
                    requirements,
                },
            ];
        }) ?? []) as Importer[];

        /**
         *
         */
        const targetDep = (Reflect.getMetadata(META_PARAMTYPES, target) ??
            []) as ClassSignature[];

        const targetDepToken = (targetDep?.map((dep: ClassSignature) =>
            Symbol.for(dep.toString())
        ) ?? []) as symbol[];

        /**
         *
         */
        const instances = new Map(providers);
        const queue = new Map(importers);
        const exposeModules = new Map<string, {}>();

        while (queue.size) {
            const cacheSize = queue.size;

            queue.forEach(({ constructor, requirements }, token) => {
                const deps: {}[] = [];

                let stop = false;
                for (const token of requirements) {
                    const dep = instances.get(token) as {} | undefined;

                    if (!dep) {
                        stop = true;
                        break;
                    }

                    deps.push(dep);
                }

                if (stop) return;

                const value = new constructor(...(deps || []));

                const expose = (Reflect.getMetadata(META_EXPOSE, constructor) ??
                    "") as string;
                if (expose) exposeModules.set(expose, value);

                instances.set(token, value);

                queue.delete(token);
            });

            if (cacheSize === queue.size) {
                console.warn("Missing dependency.");
                break;
            }
        }

        return class IoC extends target {
            constructor(...args: any[]) {
                const injections = targetDepToken.map((token: symbol) => {
                    const dep = instances.get(token);

                    if (dep) return dep;

                    throw new Error("Missing dependency.");
                });

                super(...injections);

                exposeModules.forEach((value, name) => {
                    Object.defineProperty(this, name, {
                        value,
                        writable: false,
                        configurable: false,
                    });
                });
            }
        };
    };
}
