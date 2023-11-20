import { describe, expect, it, beforeEach } from "@jest/globals";
import { Byte, ByteConvertor } from "src/utils/Byte.provider";

describe("Byte class", () => {
    it("should create an instance of Byte", () => {
        const byte = new Byte();
        expect(byte).toBeInstanceOf(Byte);
    });

    it("should have correct byte units", () => {
        const byte = new Byte();
        expect(byte.byteUnits).toEqual([
            "b",
            "kb",
            "mb",
            "gb",
            "tb",
            "pb",
            "eb",
            "zb",
            "yb",
        ]);
    });

    it("should have correct byte values", () => {
        const byte = new Byte();
        expect(byte.b).toBe(1);
        expect(byte.kb).toBe(2 ** 10);
        expect(byte.mb).toBe(2 ** 20);
        expect(byte.gb).toBe(2 ** 30);
        expect(byte.tb).toBe(2 ** 40);
        expect(byte.pb).toBe(2 ** 50);
        expect(byte.eb).toBe(2 ** 60);
        expect(byte.zb).toBe(2 ** 70);
        expect(byte.yb).toBe(2 ** 80);
    });

    it("should have correct bytesString property", () => {
        const byte = new Byte();
        const expectedByteStr = {
            b: "b",
            kb: "kb",
            mb: "mb",
            gb: "gb",
            tb: "tb",
            pb: "pb",
            eb: "eb",
            zb: "zb",
            yb: "yb",
        };

        expect(byte.bytesString).toEqual(expectedByteStr);
    });

    it("should memoize bytesString property", () => {
        const byte = new Byte();
        const firstCall = byte.bytesString;
        const secondCall = byte.bytesString;

        expect(firstCall).toBe(secondCall);
    });
});

describe("ByteConvertor", () => {
    let byteConvertor: ByteConvertor;

    beforeEach(() => {
        byteConvertor = new ByteConvertor();
    });

    it("isByteUnit should return true for valid byte unit", () => {
        expect(byteConvertor.isByteUnit("b")).toBe(true);
        expect(byteConvertor.isByteUnit("kb")).toBe(true);
    });

    it("isByteUnit should return false for invalid byte unit", () => {
        expect(byteConvertor.isByteUnit("invalid")).toBe(false);
    });

    it("hasByteUnit should return true for value with valid byte unit", () => {
        expect(byteConvertor.hasByteUnit("1kb")).toBe(true);
    });

    it("hasByteUnit should return false for value without byte unit", () => {
        expect(byteConvertor.hasByteUnit("123")).toBe(false);
    });
});
