export default class Console {
    #basicTemplate(msg: string) {
        return `[user-service] ${msg}`;
    }

    warn(msg: string) {
        const m = this.#basicTemplate(msg);

        console.warn(m);
    }

    error(msg: string) {
        const m = this.#basicTemplate(msg);

        console.error(m);
    }

    group(header: string, ...msgs: string[]) {
        const h = this.#basicTemplate(header);

        console.group(h);

        for (const msg of msgs) {
            console.log(msg);
        }

        console.groupEnd();
    }
}
