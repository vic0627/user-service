import Injectable from "src/decorator/Injectable";
import { TypeLib } from "./TypeLib";
import { Byte, ByteConvertor } from "src/utils/Byte";
import type { Limitation, Rule, RuleLiteral } from "src/types/ruleLiteral.type";

/**
 * Check and destructure RuleLiteral
 */
@Injectable()
export class StringRule {
    #limitSymbol = "@";
    #rangeSymbol = ":";
    #leftSquareBracket = "[";
    #rightSquareBracket = "]";

    constructor(
        private readonly typeLib: TypeLib,
        private readonly byteConvertor: ByteConvertor
    ) {}

    isPureType(rot: string) {
        return this.typeLib.has(rot);
    }

    hasLimitation(rot: string) {
        return rot.includes("@");
    }

    hasArray(rot: string) {
        const LBracketIdx = rot.indexOf(this.#leftSquareBracket);
        const LBracketLastIdx = rot.lastIndexOf(this.#leftSquareBracket);
        const hasValidLBracket =
            LBracketIdx !== -1 && LBracketIdx !== LBracketLastIdx;

        const RBracketIdx = rot.indexOf(this.#rightSquareBracket);
        const RBracketLastIdx = rot.lastIndexOf(this.#rightSquareBracket);
        const hasValidRBracket =
            RBracketIdx !== -1 && RBracketIdx !== RBracketLastIdx;

        if (hasValidLBracket && hasValidRBracket) return true;
        if (LBracketIdx === -1 && RBracketIdx === -1) return false;

        throw new SyntaxError(`Bad array syntax '${rot}'.`);
    }

    hasRange(rot: string) {
        const rangeIdx = rot.indexOf(this.#rangeSymbol);
        const rangeLastIdx = rot.lastIndexOf(this.#rangeSymbol);

        if (rangeIdx !== -1 && rangeIdx !== rangeLastIdx) return true;
        if (rangeIdx === -1) return false;

        throw new SyntaxError(`Bad range syntax '${rot}'.`);
    }

    evaluate(rot: RuleLiteral) {
        rot = rot.replaceAll(" ", ""); // trimming white space
        rot = rot.toLowerCase();

        if (this.isPureType(rot)) return this.#result({ type: rot });

        return this.#arrayFactory(rot);
    }

    #arrayFactory(rot: RuleLiteral) {
        if (!this.hasArray(rot)) return this.#limitationFactory(rot);

        const [_rot, _arrLimit] = rot.split(this.#leftSquareBracket);

        const arrLimit = _arrLimit.replace(this.#rightSquareBracket, "");

        let min, max;
        const arrayOptions: Limitation = {};

        if (this.hasRange(arrLimit)) {
            [min, max] = arrLimit.split(this.#rangeSymbol);
            min = +min;
            max = +max;

            if (!min && !max)
                throw new SyntaxError(
                    `Unexpected limitation of array '${arrLimit}'.`
                );

            arrayOptions.min = min;
            arrayOptions.max = max;
        } else if (!isNaN(+arrLimit)) {
            arrayOptions.equal = +arrLimit;
        } else if (arrLimit !== "")
            throw new SyntaxError("Bad array limitation.");

        return this.#limitationFactory(_rot, arrayOptions);
    }

    #limitationFactory(rot: RuleLiteral, arrayOptions?: Limitation) {
        if (this.hasLimitation(rot)) {
            /**
             * 'string@1:2', 'int@0:1[3]', .etc
             */
            const [type, limitation] = rot.split("@");

            if (!this.isPureType(type)) throw new Error("Unexpected type.");

            // if (this.hasRange(rot))
        } else if (this.hasArray(rot)) {
            this.#arrayFactory(rot);
        } else throw new SyntaxError(`Bad rule syntax '${rot}'.`);
    }

    #result(options: Rule = { type: "any" }) {
        const { type, limitation, hasArray, typeLimitation, arrayLimitation } =
            options;

        if (!type) throw new Error("Type is required.");
    }
}
