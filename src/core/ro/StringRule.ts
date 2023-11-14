import Injectable from "src/decorator/Injectable";
import { TypeLib } from "./TypeLib";
import { ByteConvertor } from "src/utils/Byte";
import type {
    Limitation,
    Rule,
    RuleLiteral,
    RuleValidator,
    TypeMetadata,
} from "src/types/ruleLiteral.type";
import { RuleErrorOption } from "src/types/ro/RuleError.type";

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
        return rot.includes(this.#limitSymbol);
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

    /**
     * main method to evaluate rot syntax
     * @param rot rot syntax string
     * @returns validation function
     * @description Program flow:
     * 1. trimming rot string
     * 2. judging if rot is pure type or not
     */
    evaluate(rot: RuleLiteral) {
        rot = rot.replaceAll(" ", "");
        rot = rot.toLowerCase();

        if (this.isPureType(rot))
            return this.#validatorGenerator({ type: rot });

        return this.#arrayFactory(rot);
    }

    #arrayFactory(rot: RuleLiteral) {
        /**
         * 1. Pass rot to limitation factory if it does not include array syntax.
         */
        if (!this.hasArray(rot)) return this.#limitationFactory(rot);

        /**
         * 2. Destructure array syntax and pass the rest of the rot and information of array limitation to limitation factory.
         */
        const [_rot, _arrLimit] = rot.split(this.#leftSquareBracket);

        const arrLimit = _arrLimit.replace(this.#rightSquareBracket, "");

        const arrayOptions: Limitation = {};

        if (this.hasRange(arrLimit)) {
            let min: string | number, max: string | number;
            [min, max] = arrLimit.split(this.#rangeSymbol) as string[];

            const lackOfValue = min === "" && max === "";

            min = +min as number;
            max = +max as number;

            const badSyntax = isNaN(min) || isNaN(max) || lackOfValue;

            if (badSyntax)
                throw new SyntaxError(
                    `Unexpected limitation of array '${arrLimit}'.`
                );

            if (min || min === 0) arrayOptions.min = min;
            if (max || max === 0) arrayOptions.max = max;
        } else if (!isNaN(+arrLimit)) {
            arrayOptions.equal = +arrLimit;
        } else if (arrLimit !== "")
            throw new SyntaxError("Bad array limitation.");

        return this.#limitationFactory(_rot, arrayOptions);
    }

    #limitationFactory(rot: RuleLiteral, arrayOptions?: Limitation) {
        if (!this.hasLimitation(rot)) throw new SyntaxError("Bad rot syntax.");

        /**
         * 1. Destructure type syntax and its limitation
         */
        const [type, limitation] = rot.split(this.#limitSymbol);

        if (!this.isPureType(type))
            throw new SyntaxError(`Unexpected type '${type}'.`);

        const typeInfo = this.typeLib.get(type) as TypeMetadata;

        const result: Rule = { type, typeInfo };

        const configLimitation = (
            target: Limitation | undefined,
            targetKey: keyof Limitation,
            limitValue: number | undefined
        ) => {
            const invalidLimit = !(limitValue || limitValue === 0);

            if (invalidLimit) return;

            target ??= {};
            target[targetKey] = limitValue;
        };

        /**
         * 2. Configure array options if it is exisited
         */
        if (arrayOptions) {
            const { min, max, equal } = arrayOptions;

            result.hasArray = true;

            let arrayLimitation: Limitation | undefined;

            configLimitation(arrayLimitation, "min", min);
            configLimitation(arrayLimitation, "max", max);
            configLimitation(arrayLimitation, "equal", equal);

            if (arrayLimitation) result.arrayLimitation = arrayLimitation;
        }

        if (!limitation) return this.#validatorGenerator(result);
        else result.limitation = true;

        const { countable, allowBytes } = typeInfo;

        if (!countable) throw new SyntaxError(`Type '${type}' is uncountable.`);

        const hasRange = this.hasRange(limitation);

        let typeLimitation: Limitation | undefined;

        if (hasRange) {
            let min: string | number, max: string | number;
            [min, max] = limitation.split(this.#rangeSymbol);

            const lackOfValue = min === "" && max === "";

            if (lackOfValue)
                throw new SyntaxError(
                    `Unexpected limitation of type '${rot}'.`
                );

            const illegalByte =
                !allowBytes &&
                (this.byteConvertor.hasByteUnit(min) ||
                    this.byteConvertor.hasByteUnit(max));

            if (illegalByte)
                throw new SyntaxError(
                    `Type '${type}' cannot be measured in byte unit.`
                );

            min = this.byteConvertor.toNumber(min);
            max = this.byteConvertor.toNumber(max);

            configLimitation(typeLimitation, "min", min);
            configLimitation(typeLimitation, "max", max);
        } else {
            const illegalByte =
                !allowBytes && this.byteConvertor.hasByteUnit(limitation);

            if (illegalByte)
                throw new SyntaxError(
                    `Type '${type}' cannot be measured in byte unit.`
                );

            const equal = this.byteConvertor.toNumber(limitation);

            configLimitation(typeLimitation, "equal", equal);
        }

        if (typeLimitation) result.typeLimitation = typeLimitation;

        return this.#validatorGenerator(result);
    }

    #validatorGenerator(options: Rule = { type: "any" }) {
        const {
            type,
            typeInfo = this.typeLib.get(type) as TypeMetadata,
            limitation = false,
            typeLimitation,
            hasArray = false,
            arrayLimitation,
        } = options;

        const { _type, measureUnit, test } = typeInfo;

        const subValidator: RuleValidator = (param, value) => {
            const typeExam = test(value);

            if (!typeExam)
                return {
                    valid: false,
                    msg: `Parameter '${param}' must be in type '${_type}'.`,
                };
            else if (!limitation) return { valid: true, msg: null };

            const msg = measureUnit
                ? `The ${measureUnit} of parameter '${param}' must be `
                : `The parameter '${param}' must be `;

            return this.#rangeValidator(
                value,
                measureUnit,
                typeLimitation as Limitation,
                msg
            );
        };

        const validator: RuleValidator = (param, value) => {
            if (!hasArray) return subValidator(param, value);

            const _value = value as unknown[];

            let validArray: boolean | undefined;
            let arrayMsg: string | undefined;

            if (arrayLimitation) {
                const arrayExam = this.#rangeValidator(
                    value,
                    "length",
                    arrayLimitation,
                    `The length of '${param}' array must be `
                );

                if (!arrayExam.valid) return arrayExam;
            }

            if (!validArray)
                return { valid: false, msg: arrayMsg } as RuleErrorOption;

            for (const key in _value) {
                if (!Object.prototype.hasOwnProperty.call(_value, key))
                    continue;

                const value = _value[key];

                const typeExam = subValidator(param, value);

                if (!typeExam.valid) return typeExam;
            }

            return { valid: true, msg: null } as RuleErrorOption;
        };

        return validator;
    }

    #rangeValidator(
        value: unknown,
        measureUnit: string | null,
        limitation: Limitation,
        msg: string
    ): RuleErrorOption {
        const { min, max, equal } = limitation;

        const validEqual = equal !== undefined;
        const validMin = min !== undefined;
        const validMax = max !== undefined;

        let valid: boolean = true;
        const _value = (
            measureUnit
                ? (value as Record<string, unknown>)[measureUnit]
                : value
        ) as number;

        if (validEqual) {
            valid = _value === equal;
            msg += `equal to ${equal}.`;
        } else if (validMin && validMax) {
            valid = _value >= min && _value <= max;
            msg += `not only greater than or equal to ${min}, but also less than or equal to ${max}.`;
        } else if (validMin) {
            valid = _value >= min;
            msg += `greater than or equal to ${min}.`;
        } else if (validMax) {
            valid = _value <= max;
            msg += `less than or equal to ${max}.`;
        }

        return { valid, msg };
    }
}
