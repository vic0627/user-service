class ROError {
	static Type = {
		type: TypeError,
		range: RangeError,
		syntax: SyntaxError,
		error: Error,
	}

	static #templateWithProp = {
		type: ({ prop, rot, receive }) =>
			`Parameter '${prop}' only accept value in '${rot}' type but receive '${receive}' instead.`,
		range: ({ prop, min, max, receive }) =>
			`Parameter '${prop}' should be between '${min}' and '${max}' but receive '${receive}' instead.`,
		equal: ({ prop, equal, receive }) =>
			`Parameter '${prop}' should be equal to '${equal}' but receive '${receive}' instead.`,
		greater: ({ prop, min, receive }) =>
			`Parameter '${prop}' should be greater than '${min}' but receive '${receive}' instead.`,
		less: ({ prop, max, receive }) =>
			`Parameter '${prop}' should be less than '${max}' but receive '${receive}' instead.`,
	}

	static #templateNoProp = {
		type: ({ rot, receive }) =>
			`Expected '${rot}' type but receive '${receive}' instead.`,
		range: ({ min, max, receive }) =>
			`The value should be between '${min}' and '${max}' but receive '${receive}' instead.`,
		equal: ({ equal, receive }) =>
			`The value should be equal to '${equal}' but receive '${receive}' instead.`,
		greater: ({ min, receive }) =>
			`The value should be greater than '${min}' but receive '${receive}' instead.`,
		less: ({ max, receive }) =>
			`The value should be less than '${max}' but receive '${receive}' instead.`,
	}

	static #useTemplate = null

	constructor({ prop, receive, rot, min, max, equal, syntax, type, message }) {
		if (this.#notNull(syntax)) return ROError.Type.syntax(syntax)

		if (!this.#notNull(receive))
			throw new Error("Parameter 'prop' and 'receive' are required.")

		if (this.#notNull(prop))
			ROError.#useTemplate = ROError.#templateWithProp
		else ROError.#useTemplate = ROError.#templateNoProp

		let err = 'range',
			str = ''

		const minNotNull = this.#notNull(min)
		const maxNotNull = this.#notNull(max)

		if (this.#notNull(rot)) {
			err = 'type'
			str += ROError.#useTemplate.type({ prop, rot, receive })
		} else if (this.#notNull(equal)) {
			str += ROError.#useTemplate.equal({ prop, equal, receive })
		} else if (minNotNull && !maxNotNull) {
			str += ROError.#useTemplate.greater({ prop, min, receive })
		} else if (maxNotNull && !minNotNull) {
			str += ROError.#useTemplate.less({ prop, max, receive })
		} else if (minNotNull && maxNotNull) {
			str += ROError.#useTemplate.range({ prop, min, max, receive })
		} else if (message) {
			err = 'error'
			str = message ?? 'Undefined custom error.'
		} else if (type) {
			err = 'type',
			str = type ?? 'Undefined TypeError.'
		}

		return ROError.Type[err](str)
	}

	#notNull(val) {
		return val !== undefined && val !== null
	}
}

export default ROError
