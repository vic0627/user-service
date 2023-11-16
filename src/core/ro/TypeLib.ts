import type {
    BasicType,
    TypeDef,
    TypeMetadata,
    TypeValidator,
} from "src/types/ruleLiteral.type";

export default class TypeLib {
    // prettier-ignore
    #def: TypeDef[] = [
        ['string', true, 'length', false, null, (value) => typeof value === "string"], ['number', true, null, false, null, (value) => typeof value === "number"],
        ['int', true, null, false, null, (value) => typeof value === "number" && Number.isInteger(value)],
        ['blob', true, 'size', true, Blob, (value) => value instanceof Blob && !(value instanceof File)],
        ['file', true, 'size', true, File, (value) => value instanceof File],
        ['filelist', true, 'length', false, FileList, (value) => value instanceof FileList],
        ['any', false, null, false, null, () => true],
        ['null', false, null, false, null, (value) => value === null || value === undefined || isNaN(+value)],
        ['boolean', false, null, false, null, (value) => typeof value === "boolean"],
        ['object', false, null, false, null, (value) => typeof value === "object" && !Array.isArray(value)],
        ['date', false, null, false, Date, (value) => value instanceof Date]
    ];

    #lib = new Map();

    constructor() {
        this.#def.forEach((def) => {
            this.#add(...def);
        });
    }

    has(type: string) {
        return this.#lib.has(type);
    }

    get(type: string): TypeMetadata | undefined {
        return this.#lib.get(type);
    }

    declareType(type: string, validator: TypeValidator) {
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
