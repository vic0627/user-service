import { ClassDecorator, ClassSignature } from "src/types/common.type";
import { IOCOptions } from "src/types/decorator.type";
import { META_PARAMTYPES, META_EXPOSE } from "src/assets/METADATA";

/**
 * Inversion of control container
 * @param options
 */
export default function IOCContainer(options: IOCOptions = {}): ClassDecorator {
    const { provides, imports } = options;

    return (target) => {
        const providers = provides?.map((slice: ClassSignature) => ({
            token: Symbol.for(slice.toString()),
            instance: new slice(),
        }));

        const importers = (imports?.map((slice) => {
            const deps = (Reflect.getMetadata(META_PARAMTYPES, slice) ??
                []) as ClassSignature[];

            const requirements = deps.map((dep: ClassSignature) =>
                Symbol.for(dep.toString())
            );

            return {
                constructor: slice,
                requirements,
            };
        }) ?? []) as { constructor: ClassSignature; requirements: symbol[] }[];

        const targetDep = (Reflect.getMetadata(META_PARAMTYPES, target) ??
            []) as ClassSignature[];

        const targetDepToken = (targetDep?.map((dep: ClassSignature) =>
            Symbol.for(dep.toString())
        ) ?? []) as symbol[];

        return class IoC extends target {
            #dependencies = new Map();
            #instances = new Map();

            constructor(...args: any[]) {
                const injections = targetDepToken?.map(
                    (token: symbol) =>
                        providers?.find((dep) => dep.token === token)
                            ?.instance ??
                        console.warn(
                            `Can't find the specific dependency '${token.toString()}'.`
                        )
                );

                super(...(injections ?? []));

                providers?.forEach(({ token, instance }) => {
                    this.#dependencies.set(token, instance);
                });

                importers?.forEach(({ constructor, requirements }) => {
                    const key = Symbol.for(constructor.toString());
                    const deps = requirements?.map(
                        (token) =>
                            this.#dependencies.get(token) ??
                            console.warn(
                                `Can't find the specific dependency '${token.toString()}'.`
                            )
                    );

                    const value = new constructor(...(deps || []));

                    const expose = (Reflect.getMetadata(
                        META_EXPOSE,
                        constructor
                    ) ?? "") as string;
                    if (expose) IoC.prototype[expose] = value;

                    this.#instances.set(key, value);
                });
            }
        };
    };
}
