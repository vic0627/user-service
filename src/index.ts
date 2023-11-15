import "reflect-metadata";
import IOCContainer from "./decorator/IOCContainer";
import { Byte, ByteConvertor } from "./utils/Byte";
import TypeLib from "./core/ro/TypeLib";
import StringRule from "./core/ro/StringRule";
import RuleArray from "./core/ro/RuleArray";

@IOCContainer({
    provides: [TypeLib, Byte, ByteConvertor],
    imports: [StringRule, RuleArray],
})
class Module {
    constructor() {}
}

export default Module;
