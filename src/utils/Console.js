export default class Console {
	static #basicTemplate(msg) {
		return `[user-service] ${msg}`
	}

	static warn(msg) {
		const m = Console.#basicTemplate(msg)

		console.warn(m)
	}

	static error(msg) {
		const m = Console.#basicTemplate(msg)

		console.error(m)
	}

	static group(header, ...msgs) {
		const h = Console.#basicTemplate(header)

		console.group(h)

		for (const msg of msgs) {
			console.log(msg)
		}

		console.groupEnd()
	}
}
