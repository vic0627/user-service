import { ValidRule } from "src/types/ruleObject.type";

export class ROArray<T> extends Array<T> {
    queue = null;
    prop = null;

    constructor(options, ...args: T[]) {
        super(...args);
    }
}

export class ROUnionArray<T extends ValidRule = ValidRule> extends ROArray<T> {
    constructor(options, ...args: T[]) {
        super(options, ...args);
    }
}

export class ROIntersectionArray<
    T extends ValidRule = ValidRule
> extends ROArray<T> {
    constructor(options, ...args: T[]) {
        super(options, ...args);
    }
}
