import type {
    BasicType,
    TypeDef,
    TypeMetadata,
    TypeValidator,
} from "src/types/ruleLiteral.type";
import TYPES from "src/assets/TYPES";

export default class TypeLib {
    #lib = new Map();

    constructor() {
        TYPES.forEach((def) => {
            this.#add(...def);
        });
    }

    has(type: string) {
        return this.#lib.has(type);
    }

    get(type: string): TypeMetadata | undefined {
        return this.#lib.get(type);
    }

    defineType(type: string, validator: TypeValidator) {
        const res = validator(null);

        if (typeof type !== "string")
            throw new TypeError(`Invalid type '${typeof type}' for 'type'`);
        if (typeof res !== "boolean")
            throw new TypeError("Type validator must return boolean value");

        this.#add(type as BasicType, false, null, false, null, validator);

        return type;
    }

    #add(...typeDef: TypeDef) {
        const [type, countable, measureUnit, allowBytes, proto, test] = typeDef;

        const typeInfo: TypeMetadata = {
            _type: type,
            countable,
            measureUnit,
            allowBytes,
            proto,
            test,
        };

        this.#lib.set(type, typeInfo);
    }
}
