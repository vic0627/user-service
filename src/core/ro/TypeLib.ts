import type { TypeDef, TypeMetadata } from "src/types/ruleLiteral.type";
import { ROError } from "./ROError";

export const initTypeLib = (): TypeDef => ({
    string: {
        countable: true,
        measureUnit: "length",
        allowBytes: false,
        proto: null,
        test: (value) => typeof value === "string",
    },
    number: {
        countable: true,
        measureUnit: null,
        allowBytes: false,
        proto: null,
        test: (value) => typeof value === "number",
    },
    int: {
        countable: true,
        measureUnit: null,
        allowBytes: false,
        proto: null,
        test: (value) => typeof value === "number" && Number.isInteger(value),
    },
    blob: {
        countable: true,
        measureUnit: "size",
        allowBytes: true,
        proto: Blob,
        test: (value) => value instanceof Blob && !(value instanceof File),
    },
    file: {
        countable: true,
        measureUnit: "size",
        allowBytes: true,
        proto: File,
        test: (value) => value instanceof File,
    },
    filelist: {
        countable: true,
        measureUnit: "length",
        allowBytes: false,
        proto: FileList,
        test: (value) => value instanceof FileList,
    },
    any: {
        countable: false,
        measureUnit: null,
        allowBytes: false,
        proto: null,
        test: () => true,
    },
    null: {
        countable: false,
        measureUnit: null,
        allowBytes: false,
        proto: null,
        test: (value) => value === null || value === undefined || isNaN(+value),
    },
    boolean: {
        countable: false,
        measureUnit: null,
        allowBytes: false,
        proto: null,
        test: (value) => typeof value === "boolean",
    },
    object: {
        countable: false,
        measureUnit: null,
        allowBytes: false,
        proto: null,
        test: (value) => typeof value === "object" && !Array.isArray(value),
    },
    date: {
        countable: false,
        measureUnit: null,
        allowBytes: false,
        proto: Date,
        test: (value) => value instanceof Date,
    },
});

export class TypeLib {
    static #lib: TypeDef = initTypeLib();

    static #instance: TypeLib;

    constructor() {
        if (!TypeLib.#instance) TypeLib.#instance = new TypeLib();

        return TypeLib.#instance;
    }

    has(type: string) {
        return type in TypeLib.#lib;
    }

    get(type: keyof TypeDef): TypeMetadata | undefined {
        return TypeLib.#lib[type];
    }

    add(type: string, metadata: TypeMetadata) {
        if (this.has(type))
            throw new ROError({
                message: `Type '${type}' has already exisited.`,
            });

        TypeLib.#lib[type] = metadata;
    }
}
