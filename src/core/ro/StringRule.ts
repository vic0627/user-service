import Injectable from "src/decorator/Injectable";
import { TypeLib } from "./TypeLib";
import type { RuleLiteral } from "src/types/ruleLiteral.type";

/**
 * Check and destructure RuleLiteral
 */
@Injectable()
export class StringRule {
    constructor(private readonly typeLib: TypeLib) {}

    isPureType(rot: RuleLiteral) {
        return this.typeLib.has(rot);
    }
}
