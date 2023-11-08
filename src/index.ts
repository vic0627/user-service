import "reflect-metadata";

class Provide {
    prop = "asd";
}

@ClassDeco
class Stack {
    #heap: unknown[] = [];

    constructor(prov: Provide) {
        this.add(prov);
    }

    public get queue() {
        return this.#heap;
    }

    public add(...args: unknown[]) {
        if (args) this.#heap.push(...args);
    }

    public pop(length?: number) {
        if (length !== undefined && length !== null) {
            this.#heap.length -= length;
            return;
        }

        this.#heap.pop();
    }
}

function ClassDeco(arg1: Function) {
    console.log({ arg1, meta: Reflect.getMetadata("design:paramtypes", arg1) });
}

console.log("us module onload");

export default Stack;
