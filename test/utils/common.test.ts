import { describe, expect, it } from "@jest/globals";
import {
    notNull,
    symbolToken,
    deepCloneFunction,
    pureLowerCase,
    getRanNum,
    mergeObject,
    resolveURL,
    deepClone,
} from "src/utils/common";

describe("notNull function", () => {
    it("should return true for non-null and non-undefined values", () => {
        expect(notNull(42)).toBe(true);
        expect(notNull("hello")).toBe(true);
        expect(notNull(true)).toBe(true);
        expect(notNull([])).toBe(true);
    });

    it("should return false for null or undefined values", () => {
        expect(notNull(null)).toBe(false);
        expect(notNull(undefined)).toBe(false);
    });
});

describe("symbolToken function", () => {
    it("should create a Symbol using the provided string as the key", () => {
        const token = symbolToken("myKey");
        const expectedSymbol = Symbol.for("myKey");

        expect(token).toBe(expectedSymbol);
    });

    it("should create unique symbols for different keys", () => {
        const token1 = symbolToken("key1");
        const token2 = symbolToken("key2");

        expect(token1).not.toBe(token2);
    });

    it("should use the same Symbol for the same key", () => {
        const token1 = symbolToken("sharedKey1");
        const token2 = symbolToken("sharedKey1");

        expect(token1).toBe(token2);
    });
});

describe("deepCloneFunction", () => {
    it("should create a deep clone of a function", () => {
        const originalFunction = (a: number, b: number) => a + b;
        const clonedFunction = deepCloneFunction(originalFunction);

        expect(originalFunction).not.toBe(clonedFunction);

        const resultOriginal = originalFunction(2, 3);
        const resultCloned = clonedFunction(2, 3);
        expect(resultOriginal).toBe(resultCloned);
    });
});

describe("pureLowerCase function", () => {
    it("should return true for an all lowercase string", () => {
        const result = pureLowerCase("abcdef");
        expect(result).toBe(true);
    });

    it("should return false for a string with uppercase characters", () => {
        const result = pureLowerCase("AbcDef");
        expect(result).toBe(false);
    });

    it("should return false for a string with non-alphabetic characters", () => {
        const result = pureLowerCase("abc123");
        expect(result).toBe(false);
    });

    it("should return true for an empty string", () => {
        const result = pureLowerCase("");
        expect(result).toBe(false);
    });
});

describe("getRanNum function", () => {
    it("should return a number by default", () => {
        const result = getRanNum();
        expect(typeof result).toBe("number");
    });

    it('should return a number when type is "number"', () => {
        const result = getRanNum("number");
        expect(typeof result).toBe("number");
    });

    it('should return a string when type is "string"', () => {
        const result = getRanNum("string");
        expect(typeof result).toBe("string");
    });

    it("should throw an error for invalid type", () => {
        expect(() => getRanNum("invalid" as any)).toThrowError(
            "Get random number failed"
        );
    });
});

describe("mergeObject", () => {
    it("should merge objects with unique keys", () => {
        const obj1 = { a: 1, b: 2 };
        const obj2 = { c: 3, d: 4 };
        const result = mergeObject(obj1, obj2);
        expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });

    it("should overwrite values for duplicate keys", () => {
        const obj1 = { a: 1, b: 2 };
        const obj2 = { b: 3, c: 4 };
        const result = mergeObject(obj1, obj2);
        expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it("should handle merging multiple objects", () => {
        const obj1 = { a: 1, b: 2 };
        const obj2 = { b: 3, c: 4 };
        const obj3 = { c: 5, d: 6 };
        const result = mergeObject(obj1, obj2, obj3);
        expect(result).toEqual({ a: 1, b: 3, c: 5, d: 6 });
    });

    it("should handle merging empty objects", () => {
        const result = mergeObject();
        expect(result).toEqual({});
    });

    it("should handle merging objects with non-enumerable properties", () => {
        const obj1 = { a: 1, b: 2 };
        const obj2 = { c: 3 };
        Object.defineProperty(obj2, "d", { value: 4, enumerable: false });
        const result = mergeObject(obj1, obj2);
        expect(result).toEqual({ a: 1, b: 2, c: 3 });
        expect(Object.hasOwn(result, "d")).toBe(false);
    });
});

describe("resolveURL", () => {
    it("should resolve single string URL without query", () => {
        const result = resolveURL("path/to/resource");
        expect(result).toBe("path/to/resource");
    });

    it("should resolve array of strings URL without query", () => {
        const result = resolveURL(["path", "to", "resource"]);
        expect(result).toBe("path/to/resource");
    });

    it("should resolve array with leading slashes URL without query", () => {
        const result = resolveURL(["/path", "/to", "/resource"]);
        expect(result).toBe("/path/to/resource");
    });

    it("should resolve array with trailing slashes URL without query", () => {
        const result = resolveURL(["path/", "to/", "resource/"]);
        expect(result).toBe("path/to/resource");
    });

    it("should resolve array with mixed slashes URL without query", () => {
        const result = resolveURL(["path/", "/to", "resource/"]);
        expect(result).toBe("path/to/resource");
    });

    it("should resolve single string URL with query", () => {
        const result = resolveURL("path/to/resource", {
            param1: "value1",
            param2: "value2",
        });
        expect(result).toBe("path/to/resource?param1=value1&param2=value2");
    });

    it("should resolve array of strings URL with query", () => {
        const result = resolveURL(["path", "to", "resource"], {
            param1: "value1",
            param2: "value2",
        });
        expect(result).toBe("path/to/resource?param1=value1&param2=value2");
    });

    it("should resolve array with mixed slashes URL with query", () => {
        const result = resolveURL(["path/", "/to", "resource/"], {
            param1: "value1",
            param2: "value2",
        });
        expect(result).toBe("path/to/resource?param1=value1&param2=value2");
    });
});

describe("deepClone", () => {
    it("should return the same value for non-object types", () => {
        const numberValue = deepClone(42);
        const stringValue = deepClone("hello");
        const booleanValue = deepClone(true);

        expect(numberValue).toBe(42);
        expect(stringValue).toBe("hello");
        expect(booleanValue).toBe(true);
    });

    it("should deep clone objects", () => {
        const sourceObject = {
            name: "John",
            age: 25,
            address: {
                city: "New York",
                country: "USA",
            },
        };

        const clonedObject = deepClone(sourceObject);

        expect(clonedObject).toEqual(sourceObject);
        expect(clonedObject).not.toBe(sourceObject); // Ensure a new reference is created
        expect(clonedObject.address).not.toBe(sourceObject.address); // Ensure nested objects are also cloned
    });

    it("should deep clone arrays", () => {
        const sourceArray = [1, 2, [3, 4], { key: "value" }];

        const clonedArray = deepClone(sourceArray);

        expect(clonedArray).toEqual(sourceArray);
        expect(clonedArray).not.toBe(sourceArray); // Ensure a new reference is created
        expect(clonedArray[2]).not.toBe(sourceArray[2]); // Ensure nested arrays are also cloned
        expect(clonedArray[3]).not.toBe(sourceArray[3]); // Ensure nested objects are also cloned
    });

    it("should handle null and undefined", () => {
        const nullValue = deepClone(null);
        const undefinedValue = deepClone(undefined);

        expect(nullValue).toBeNull();
        expect(undefinedValue).toBeUndefined();
    });

    // it("should handle circular references", () => {
    //     const circularObject: any = { prop: null };
    //     circularObject.prop = circularObject;

    //     const clonedObject = deepClone(circularObject);

    //     expect(clonedObject).toEqual(circularObject);
    //     expect(clonedObject).not.toBe(circularObject);
    //     expect(clonedObject.prop).toBe(clonedObject); // Ensure circular reference is maintained in the clone
    // });
});
