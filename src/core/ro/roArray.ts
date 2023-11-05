import ROTypes from "./roTypes";
import ROTError from "./ROError";

class ROTArray extends Array {
    queue = null;
    prop = null;

    constructor(options, args) {
        super(...args);

        const { propName } = options;

        this.prop = propName;
    }

    evaluate() {
        this.queue = this.map((rot) => {
            return ROTypes.evaluate(this.prop, rot);
        });
    }

    /**
     * Set the target that you want to validate
     * @param {string} propName
     * @returns {ThisType<ROTArray>}
     */
    setProp(propName) {
        if (propName.startsWith("$"))
            throw new ROTError({
                syntax: `'propName' should not starts with the optional notation '$'.`,
            });

        this.prop = propName;

        return this;
    }
}

class ROTUnionArray extends ROTArray {
    constructor(options, args) {
        super(options, args);
    }

    validate(value) {
        this.queue.some((validator) => {
            const { result } = validator(value);

            if (!result) {
            }
        });
    }
}

class ROTIntersectionArray extends ROTArray {
    constructor(options, args) {
        super(options, args);
    }
}

const declareROTA = (options, args) => {
    const { collectionType } = options;

    if (collectionType === "union") return new ROTUnionArray(options, args);
    else if (collectionType === "intersection")
        return new ROTIntersectionArray(options, args);
};

export const declareUnion = (args, options = {}) => {
    options.collectionType = "union";

    return declareROTA(options, args);
};

export const declareIntersection = (args, options = {}) => {
    options.collectionType = "intersection";

    return declareROTA(options, args);
};
