// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ByteConvertor from '../../utils/ByteConvertor'
import ROTError from './ROError'
import { notNull } from '../../utils/validator'
import ROError from './ROError'

class ROTypes {
	static #ROTLib = {
		string: {
			countable: true,
			measureObject: 'length',
			allowBytes: false,
			proto: null,
			typeValidator: (value) => typeof value === 'string',
		},
		number: {
			countable: true,
			measureObject: null,
			allowBytes: false,
			proto: null,
			typeValidator: (value) => typeof value === 'number',
		},
		int: {
			countable: true,
			measureObject: null,
			allowBytes: false,
			proto: null,
			typeValidator: (value) =>
				typeof value === 'number' && Number.isInteger(value),
		},
		blob: {
			countable: true,
			measureObject: 'size',
			allowBytes: true,
			proto: Blob,
			typeValidator: (value) =>
				value instanceof Blob && !(value instanceof File),
		},
		file: {
			countable: true,
			measureObject: 'size',
			allowBytes: true,
			proto: File,
			typeValidator: (value) => value instanceof File,
		},
		filelist: {
			countable: true,
			measureObject: 'length',
			allowBytes: false,
			proto: FileList,
			typeValidator: (value) => value instanceof FileList,
		},
		any: {
			countable: false,
			measureObject: null,
			allowBytes: false,
			proto: null,
			typeValidator: () => true,
		},
		null: {
			countable: false,
			measureObject: null,
			allowBytes: false,
			proto: null,
			typeValidator: (value) =>
				value === null || value === undefined || isNaN(value),
		},
		boolean: {
			countable: false,
			measureObject: null,
			allowBytes: false,
			proto: null,
			typeValidator: (value) => typeof value === 'boolean',
		},
		object: {
			countable: false,
			measureObject: null,
			allowBytes: false,
			proto: null,
			typeValidator: (value) =>
				typeof value === 'object' && !Array.isArray(value),
		},
		date: {
			countable: false,
			measureObject: null,
			allowBytes: false,
			proto: Date,
			typeValidator: (value) => value instanceof Date,
		},
	}

	static get #roTypes() {
		return Object.keys(ROTypes.#ROTLib)
	}

	constructor() {}

	/**
	 * Main function to convert ROT syntax into validator
	 * @param {string} prop
	 * @param {string | ((value: any) => ({ result: boolean; errorMessage?: string; })) | RegExp} rot
	 */
	evaluate(prop, rot) {
		let validator

		const rotType = typeof rot

		if (rotType === 'function')
			validator = this.#createFunctionValidator(prop, rot)
		else if (rot instanceof RegExp)
			validator = this.#createRegexpValidator(prop, rot)
		else if (rotType === 'string') {
			rot = rot.replaceAll(' ', '')

			validator = this.#createRotValidator(prop, rot)
		} else throw new Error('Invalid rule provided.')

		return validator
	}

	#checkRot(rot) {
		const roType = typeof rot

		const checkResult = {
			rotCheck: true,
			roTypes: null,
			reason: null,
			rot,
		}

		if (roType === 'string') {
			this.#checkRotSyntax(rot, checkResult)

			return checkResult
		}

		if (roType === 'function') {
			/**
			 * To prevent uncertain custom validator causing crush,
			 * use `try...catch` to capture the error that might be thrown.
			 */
			try {
				const { result } = rot()

				checkResult.roTypes = 'function'

				if (!notNull(result))
					console.warn(
						'[US Warn] Type checking may fail without returning correct return type from the validator.'
					)

				return checkResult
			} catch (error) {
				console.error(error)
			}
		}

		if (roType instanceof RegExp) {
			checkResult.roTypes = 'regexp'

			return checkResult
		}

		throw new ROError({
			type: 'Rule should be either a string, a function, or a regexp.',
		})
	}

	#checkRotSyntax(rot, checkResult) {
		const hasLimitation = this.#hasLimitation(rot)
		const hasArray = this.#hasArray(rot)

		checkResult.roTypes = 'rot'

		/**
		 * Additional metadata
		 */
		checkResult.hasLimitation = hasLimitation
		checkResult.hasArray = hasArray

		let type, typeMin, typeMax, tyeEqual, arrMin, arrMax, arrEqual

		const pureType =
			!hasLimitation && !hasArray && ROTypes.#roTypes.includes(rot)

		/**
		 * 'string', 'int', 'number' .etc
		 */
		if (!pureType) throw new ROError({ syntax: `Invalid type '${rot}'.` })
		// else return

		/**
		 * 'string@6', 'int@0:1' .etc
		 */
		if (hasLimitation && !hasArray) {
			const [_type, range] = rot.split('@')

			const validType = ROTypes.#roTypes.includes(_type)
			
			/**
			 * type check
			 */
			if (!validType)
				throw new ROError({ syntax: `Invalid type '${_type}'.` })

			type = _type

			const {countable, allowBytes} = ROTypes.#ROTLib[_type]

			const uncountable = !countable && (range !== '' || range !== undefined)
			
			/**
			 * countable check
			 */
			if (uncountable) throw new ROError({ syntax: `Type '${_type}' is uncountable.` })

			const hasRange = this.#hasRange(range)

			/**
			 * range check
			 */
			if (hasRange) {
				const [min, max] = range.split(':')

				min = 
			} else {

			}
		}

		// return
	}

	#createFunctionValidator(prop, rot) {
		return (value) => {
			const { result, errorMessage } = rot(value)

			return {
				receive: value,
				result,
				prop,
				syntax: errorMessage ?? 'Undefined custom error.',
			}
		}
	}

	#createRegexpValidator(prop, regexp) {
		const test = regexp.test

		if (!test) throw new Error(`Invalid Regexp ${regexp} provided.`)

		return this.#validatorInterface((value) => {
			const result = test(value)

			return {
				receive: value,
				prop,
				result,
				syntax: `Validation failed with given value '${value}' in '${prop}' with '${regexp}' test case.`,
			}
		})
	}

	#createRotValidator(prop, rot) {
		const hasLimitation = this.#hasLimitation(rot)
		const hasArray = this.#hasArray(rot)

		/**
		 * 'Types' without limitaion or array. ex. `string`, `number` .etc
		 */
		const isPureRot = !hasArray && !hasLimitation
		if (isPureRot) {
			const lib = ROTypes.#ROTLib[rot]

			if (!lib)
				throw new SyntaxError(`Invalid type '${rot}' has provided.`)

			return this.#validatorInterface((value) => {
				const result = lib.typeValidator(value)

				return { prop, receive: value, rot, result }
			})
		}

		/**
		 * Type that owns limitation but without array. ex. `string@1:15`, `int@5:` .etc
		 */
		const onlyHasLimitation = hasLimitation && !hasArray
		if (onlyHasLimitation) return this.#createLimitationValidator(prop, rot)

		/**
		 * Types that are serielized as an array but without limitation of its value inside.
		 * ex. `string[]`, `number[10:20]` .etc
		 */
		const onlyHasArray = hasArray && !hasLimitation
		if (onlyHasArray) {
			/**
			 * @todo
			 */
		}

		/**
		 * Types that have both limitation and are serielized as an array.
		 * ex. `int@0:[3:]`, `string@:20[:5]` .etc
		 */
		const hasBoth = hasLimitation && hasArray
		if (hasBoth) {
			/**
			 * @todo
			 */
		}
	}

	#createLimitationValidator(prop, rot) {
		const { minValue, maxValue, equalValue, ROT } =
			this.#destructLimition(rot)
		const lib = RuleObjectTypes.#ROTLib[ROT]

		if (!lib) throw new SyntaxError(`Invalid type '${ROT}' has provided.`)

		if (!lib.countable)
			throw new SyntaxError(`Type '${ROT}' is uncountable.`)

		let rangeValidator

		const eqNotNull = notNull(equalValue)
		const mnNotNull = notNull(minValue)
		const mxNotNull = notNull(maxValue)

		const isEqual = eqNotNull && mnNotNull && mxNotNull
		const isMin = !eqNotNull && mnNotNull && !mxNotNull
		const isMax = !eqNotNull && !mnNotNull && mxNotNull
		const isRange = !eqNotNull && !mnNotNull && !mxNotNull

		let expression

		if (isEqual) expression = (value) => value !== equalValue
		else if (isMin) expression = (value) => value < minValue
		else if (isMax) expression = (value) => value > maxValue
		else if (isRange)
			expression = (value) => value > maxValue || value < minValue

		let min = minValue,
			max = maxValue,
			equal = equalValue

		if (lib.measureObject === RuleObjectTypes.#ROTLib.blob.measureObject) {
			min = ByteConvertor.toString(min)
			max = ByteConvertor.toString(max)
			equal = ByteConvertor.toString(equal)
		}

		rangeValidator = this.#validatorInterface((value) => {
			let result = true

			if (expression(value)) result = false

			return {
				receive: value,
				prop,
				result,
				min,
				max,
				equal,
			}
		})

		return (value) => {
			let res = true

			if (!lib.typeValidator(value)) res = false

			const val = lib.measureObject ? value[lib.measureObject] : value

			const { result, prop, receive, min, max, equal } =
				rangeValidator(val)

			return {
				result: res || result,
				prop,
				receive,
				min,
				max,
				equal,
			}
		}
	}

	/**
	 *
	 * @param {(value: any) => ({result: boolean; prop: string; receive: any; rot?: Regexp | string; min?: string | number;  max?: string | number;  equal?: string | number; syntax?: string})} validateFunc
	 * @returns
	 */
	#validatorInterface(validateFunc) {
		return (value) => {
			const { result, prop, receive, rot, min, max, equal, syntax } =
				validateFunc(value)
			return { result, prop, receive, rot, min, max, equal, syntax }
		}
	}

	/**
	 * Check if a ROT cantains limitation rule.
	 * @param {string} rot
	 * @returns {boolean}
	 */
	#hasLimitation(rot) {
		const fromStart = rot.indexOf('@')
		const fromEnd = rot.lastIndexOf('@')

		if (fromStart === -1) return false

		if (fromStart === fromEnd) return true

		throw new ROError({ syntax: "Duplicated limit notation '@' detected." })
	}

	/**
	 * Check if a ROT cantains range syntax.
	 * @param {string} rot
	 * @returns {boolean}
	 */
	#hasRange(rot) {
		const fromStart = rot.indexOf(':')
		const fromEnd = rot.lastIndexOf(':')

		if (fromStart === -1) return false

		if (fromStart === fromEnd) return true

		throw new ROError({ syntax: "Duplicated limit notation ':' detected." })
	}

	#hasArray(rot) {
		/**
		 * LSB === LeftSquareBracket
		 * RSB === RightSquareBracket
		 */

		const idxLSB = rot.indexOf('[')
		const idxRSB = rot.indexOf(']')

		const hasLSB = idxLSB !== -1
		const hasRSB = idxRSB !== -1

		const duplicatedBrackets =
			rot.lastIndexOf('[') === idxLSB || rot.lastIndexOf(']') === idxRSB

		const completeBrackets = hasLSB && hasRSB
		const singleBracket = hasLSB || !hasRSB || hasRSB || !hasLSB

		if (completeBrackets) return true
		else if (singleBracket)
			throw new ROError({
				syntax: 'Array ROT must includes both left and right square brakets.',
			})
		else if (duplicatedBrackets) {
			throw new ROError({ syntax: 'Duplicated brackets in ROT.' })
		} else return false
	}

	#isPureLimitation(limit) {
		if (limit === '') return true

		return /^[0-9.]+$/.test(limit)
	}

	#destructLimition(rot) {
		let limitation = rot.split('@')

		const ROT = limitation[0]
		limitation = limitation[1] ?? ''

		if (this.#hasArray(limitation)) limitation = limitation.split('[')[0]

		let minValue = null,
			maxValue = null,
			equalValue = null

		if (this.#hasRange(limitation)) {
			const [mn, mx] = limitation.split(':')

			minValue = mn === '' ? null : mn
			maxValue = mx === '' ? null : mx
		} else equalValue = limitation

		if (RuleObjectTypes.#ROTLib[ROT].allowBytes) {
			minValue &&= ByteConvertor.toNumber(minValue)
			maxValue &&= ByteConvertor.toNumber(maxValue)
			equalValue &&= ByteConvertor.toNumber(equalValue)
		}

		return {
			ROT,
			minValue,
			maxValue,
			equalValue,
		}
	}

	#destructArray(rot) {
		let brackets = rot.split('[')

		let ROT = brackets[0]
		brackets = brackets[1]

		if (this.#hasLimitation(ROT)) ROT = ROT.split('@')[0]

		if (this.#hasLimitation(brackets))
			throw new SyntaxError(
				"Square brackets must not contain '@' symbol."
			)

		// cut off ']'
		brackets = brackets.slice(0, brackets.length - 1)

		let minLength = null,
			maxLength = null,
			equalLength = null

		if (this.#hasRange(brackets)) {
			const [mn, mx] = brackets.split(':')

			if (!this.#isPureLimitation(mn) || !this.#isPureLimitation(mx))
				throw new ROTError({
					syntax: `Unexpected token in min or max value at type '${ROT}'`,
				})

			minLength = mn === '' ? null : +mn
			maxLength = mx === '' ? null : +mx
		} else {
			if (!this.#isPureLimitation(brackets))
				throw new ROTError({
					syntax: `Unexpected token in equation value at type '${ROT}'`,
				})

			equalLength = +brackets
		}

		return {
			minLength,
			maxLength,
			equalLength,
			ROT,
		}
	}
}

export default new ROTypes()
