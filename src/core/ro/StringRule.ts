import { DependencyInjection } from "src/types/di";
import { TypeLib } from "./TypeLib";
import type { RuleLiteral } from "src/types/ruleLiteral.type";

type ROLiteralDependencies = Required<Pick<DependencyInjection, "typeLib">>;

/**
 * Check and destructure RuleLiteral
 */
export class ROLiteral {
    static #instance: ROLiteral;

    typeLib: TypeLib;

    constructor(di: ROLiteralDependencies) {
        if (!ROLiteral.#instance) ROLiteral.#instance = new ROLiteral(di);

        this.typeLib = di.typeLib;

        return ROLiteral.#instance;
    }

    isPureType(rot: RuleLiteral) {
        return this.typeLib.has(rot);
    }
}
