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

console.log("us module onload");

export default Stack;
