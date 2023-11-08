import type { ByteUnit, ByteString, ByteLib } from "src/types/byte.type";
import { NumOrString } from "src/types/common.type";

export class Byte {
    static byteUnits: ByteUnit[] = [
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

    static b = 1;
    static kb = 2 ** 10;
    static mb = 2 ** 20;
    static gb = 2 ** 30;
    static tb = 2 ** 40;
    static pb = 2 ** 50;
    static eb = 2 ** 60;
    static zb = 2 ** 70;
    static yb = 2 ** 80;

    static get bytesString(): ByteLib {
        const str: ByteLib | Record<string, string> = {};

        Byte.byteUnits.forEach((unit) => {
            str[unit] = unit;
        });

        return str;
    }
}

export class ByteConvertor extends Byte {
    static isByteUnit(value: string) {
        return value in ByteConvertor.bytesString;
    }

    static hasByteUnit(value: string) {
        if (!isNaN(+value)) return false;

        return ByteConvertor.byteUnits.reduce((pre, cur) => {
            if (pre) return pre;

            return value.endsWith(cur);
        }, false);
    }

    static toNumber(value: string) {
        if (ByteConvertor.isByteUnit(value))
            return ByteConvertor.unitToBytes(value);

        return +value;
    }

    static toString(value: number) {
        return ByteConvertor.bytesToUnit(value);
    }

    /**
     * 將數字(bytes)轉換為最接近的對應單位的儲存容量
     * @param {NumOrString} bytes
     * @returns {ByteString} unit
     */
    static bytesToUnit(bytes: NumOrString): ByteString {
        if (isNaN(+bytes)) throw new Error(`Invalid bytes '${bytes}' provided`);

        bytes = +bytes;

        if (bytes < ByteConvertor.kb) {
            return `${bytes}b`;
        } else if (bytes >= ByteConvertor.kb && bytes < ByteConvertor.mb) {
            return `${(bytes / ByteConvertor.kb).toFixed(2)}kb`;
        } else if (bytes < ByteConvertor.gb) {
            return `${(bytes / ByteConvertor.mb).toFixed(2)}mb`;
        } else if (bytes < ByteConvertor.tb) {
            return `${(bytes / ByteConvertor.gb).toFixed(2)}gb`;
        } else if (bytes < ByteConvertor.pb) {
            return `${(bytes / ByteConvertor.tb).toFixed(2)}tb`;
        } else if (bytes < ByteConvertor.eb) {
            return `${(bytes / ByteConvertor.pb).toFixed(2)}pb`;
        } else if (bytes < ByteConvertor.zb) {
            return `${(bytes / ByteConvertor.eb).toFixed(2)}eb`;
        } else if (bytes < ByteConvertor.yb) {
            return `${(bytes / ByteConvertor.zb).toFixed(2)}zb`;
        } else {
            return `${(bytes / ByteConvertor.yb).toFixed(2)}yb`;
        }
    }

    /**
     * 將含有單位的儲存容量轉換為數字(bytes)
     * @param {ByteString | string} unit
     * @returns {number} bytes
     */
    static unitToBytes(unit: ByteString | ByteUnit | string): number {
        if (!ByteConvertor.hasByteUnit(unit))
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
                return ~~(numericValue * ByteConvertor.kb);
            case "m":
                return ~~(numericValue * ByteConvertor.mb);
            case "g":
                return ~~(numericValue * ByteConvertor.gb);
            case "t":
                return ~~(numericValue * ByteConvertor.tb);
            case "p":
                return ~~(numericValue * ByteConvertor.pb);
            case "e":
                return ~~(numericValue * ByteConvertor.eb);
            case "z":
                return ~~(numericValue * ByteConvertor.zb);
            case "y":
                return ~~(numericValue * ByteConvertor.yb);
            default:
                throw new Error(`Invalid unit '${unit}' provided`);
        }
    }
}
