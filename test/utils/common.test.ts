import { describe, expect, it } from "@jest/globals";
import {
    notNull,
    symbolToken,
    deepCloneFunction,
    pureLowerCase,
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
