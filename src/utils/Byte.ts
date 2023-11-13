import type { ByteUnit, ByteString, ByteLib } from "src/types/byte.type";
import { NumOrString } from "src/types/common.type";

export class Byte {
    byteUnits: ByteUnit[] = [
        "b",
        "kb",
        "mb",
        "gb",
        "tb",
        "pb",
        "eb",
        "zb",
        "yb",
    ];

    b = 1;
    kb = 2 ** 10;
    mb = 2 ** 20;
    gb = 2 ** 30;
    tb = 2 ** 40;
    pb = 2 ** 50;
    eb = 2 ** 60;
    zb = 2 ** 70;
    yb = 2 ** 80;

    #byteStr: ByteLib | undefined;

    get bytesString(): ByteLib {
        if (this.#byteStr) return this.#byteStr;

        const str: ByteLib | Record<string, string> = {};

        this.byteUnits.forEach((unit) => {
            str[unit] = unit;
        });

        this.#byteStr = str;

        return str;
    }
}

export class ByteConvertor extends Byte {
    constructor() {
        super();
    }

    isByteUnit(value: string) {
        return value in this.bytesString;
    }

    hasByteUnit(value: string) {
        if (!isNaN(+value)) return false;

        return this.byteUnits.reduce((pre, cur) => {
            if (pre) return pre;

            return value.endsWith(cur);
        }, false);
    }

    toNumber(value: string) {
        if (this.isByteUnit(value)) return this.unitToBytes(value);

        return +value;
    }

    toString(value: number) {
        return this.bytesToUnit(value);
    }

    /**
     * 將數字(bytes)轉換為最接近的對應單位的儲存容量
     * @param {NumOrString} bytes
     * @returns {ByteString} unit
     */
    bytesToUnit(bytes: NumOrString): ByteString {
        if (isNaN(+bytes)) throw new Error(`Invalid bytes '${bytes}' provided`);

        bytes = +bytes;

        if (bytes < this.kb) {
            return `${bytes}b`;
        } else if (bytes >= this.kb && bytes < this.mb) {
            return `${(bytes / this.kb).toFixed(2)}kb`;
        } else if (bytes < this.gb) {
            return `${(bytes / this.mb).toFixed(2)}mb`;
        } else if (bytes < this.tb) {
            return `${(bytes / this.gb).toFixed(2)}gb`;
        } else if (bytes < this.pb) {
            return `${(bytes / this.tb).toFixed(2)}tb`;
        } else if (bytes < this.eb) {
            return `${(bytes / this.pb).toFixed(2)}pb`;
        } else if (bytes < this.zb) {
            return `${(bytes / this.eb).toFixed(2)}eb`;
        } else if (bytes < this.yb) {
            return `${(bytes / this.zb).toFixed(2)}zb`;
        } else {
            return `${(bytes / this.yb).toFixed(2)}yb`;
        }
    }

    /**
     * 將含有單位的儲存容量轉換為數字(bytes)
     * @param {ByteString | string} unit
     * @returns {number} bytes
     */
    unitToBytes(unit: ByteString | ByteUnit | string): number {
        if (!this.hasByteUnit(unit))
            throw new Error(`Invalid numeric value '${unit}'`);

        const numericValue = parseFloat(unit);

        let unitChar: string = "";

        for (let i = unit.length - 1; i >= 0; i--) {
            const char: string = unit[i];

            if (!isNaN(+char)) break;

            unitChar = char + unitChar;
        }

        switch (unitChar) {
            case "b":
                return ~~numericValue;
            case "k":
                return ~~(numericValue * this.kb);
            case "m":
                return ~~(numericValue * this.mb);
            case "g":
                return ~~(numericValue * this.gb);
            case "t":
                return ~~(numericValue * this.tb);
            case "p":
                return ~~(numericValue * this.pb);
            case "e":
                return ~~(numericValue * this.eb);
            case "z":
                return ~~(numericValue * this.zb);
            case "y":
                return ~~(numericValue * this.yb);
            default:
                throw new Error(`Invalid unit '${unit}' provided`);
        }
    }
}
