export default class Console {
    static #basicTemplate(msg: string) {
        return `[user-service] ${msg}`;
    }

    static warn(msg: string) {
        const m = Console.#basicTemplate(msg);

        console.warn(m);
    }

    static error(msg: string) {
        const m = Console.#basicTemplate(msg);

        console.error(m);
    }

    static group(header: string, ...msgs: string[]) {
        const h = Console.#basicTemplate(header);

        console.group(h);

        for (const msg of msgs) {
            console.log(msg);
        }

        console.groupEnd();
    }
}
