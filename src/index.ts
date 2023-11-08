@ClassDeco
class Stack {
    #heap: unknown[] = [];

    constructor(...args: unknown[]) {
        this.add(...args);
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

function ClassDeco(arg1: unknown, arg2: unknown) {
    console.log({ arg1, arg2 });
}

console.log("us module onload");

export default Stack;
