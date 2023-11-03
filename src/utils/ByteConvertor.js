class ByteConvertor {
	static get bytes() {
		return {
			b: 1,
			kb: 2 ** 10,
			mb: 2 ** 20,
			gb: 2 ** 30,
			tb: 2 ** 40,
			pb: 2 ** 50,
			eb: 2 ** 60,
			zb: 2 ** 70,
			yb: 2 ** 80,
		}
	}

	/**
	 * @enum
	 */
	static get bytesString() {
		return {
			b: 'b',
			kb: 'kb',
			mb: 'mb',
			gb: 'gb',
			tb: 'tb',
			pb: 'pb',
			eb: 'eb',
			zb: 'zb',
			yb: 'yb',
		}
	}

	static get bytesStringArr() {
		return ['b', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb']
	}

	static isByteUnit(value) {
		return value in ByteConvertor.bytesString
	}

	static hasByteUnit(value) {
		if (!isNaN(+value)) return false

		return ByteConvertor.bytesStringArr.reduce((pre, cur) => {
			if (pre) return pre

			return value.includes(cur)
		}, false)
	}

	static toNumber(value) {
		if (ByteConvertor.isByteUnit) return ByteConvertor.unitToBytes(value)

		return +value
	}

	static toString(value) {
		return ByteConvertor.bytesToUnit(value)
	}

	/**
	 * 將數字(bytes)轉換為最接近的對應單位的儲存容量
	 * @param {number | string} bytes
	 * @returns {`${number}b` | `${number}kb` | `${number}mb` | `${number}gb` | `${number}tb` | `${number}zb` | `${number}eb` | `${number}zb` | `${number}yb`} unit
	 */
	static bytesToUnit(bytes) {
		if (isNaN(+bytes)) throw new Error(`Invalid bytes '${bytes}' provided`)

		bytes = +bytes

		if (bytes < this.bytes.kb) {
			return `${bytes}b`
		} else if (bytes >= this.bytes.kb && bytes < this.bytes.mb) {
			return `${(bytes / this.bytes.kb).toFixed(2)}kb`
		} else if (bytes < this.bytes.gb) {
			return `${(bytes / this.bytes.mb).toFixed(2)}mb`
		} else if (bytes < this.bytes.tb) {
			return `${(bytes / this.bytes.gb).toFixed(2)}gb`
		} else if (bytes < this.bytes.pb) {
			return `${(bytes / this.bytes.tb).toFixed(2)}tb`
		} else if (bytes < this.bytes.eb) {
			return `${(bytes / this.bytes.pb).toFixed(2)}pb`
		} else if (bytes < this.bytes.zb) {
			return `${(bytes / this.bytes.eb).toFixed(2)}eb`
		} else if (bytes < this.bytes.yb) {
			return `${(bytes / this.bytes.zb).toFixed(2)}zb`
		} else {
			return `${(bytes / this.bytes.yb).toFixed(2)}yb`
		}
	}

	/**
	 * 將含有單位的儲存容量轉換為數字(bytes)
	 * @param {`${number}b` | `${number}kb` | `${number}mb` | `${number}gb` | `${number}tb` | `${number}zb` | `${number}eb` | `${number}zb` | `${number}yb`} unit
	 * @returns {number} bytes
	 */
	static unitToBytes(unit) {
		const numericValue = parseFloat(unit)

		if (isNaN(numericValue))
			throw new Error(`Invalid numeric value '${unit}'`)

		let unitChar = isNaN(+unit) ? unit.charAt(unit.length - 2) : 'b'

		if (!isNaN(unitChar)) unit = unit.charAt(unit.length - 1)

		switch (unitChar) {
			case 'b':
				return ~~numericValue
			case 'k':
				return ~~(numericValue * this.bytes.kb)
			case 'm':
				return ~~(numericValue * this.bytes.mb)
			case 'g':
				return ~~(numericValue * this.bytes.gb)
			case 't':
				return ~~(numericValue * this.bytes.tb)
			case 'p':
				return ~~(numericValue * this.bytes.pb)
			case 'e':
				return ~~(numericValue * this.bytes.eb)
			case 'z':
				return ~~(numericValue * this.bytes.zb)
			case 'y':
				return ~~(numericValue * this.bytes.yb)
			default:
				throw new Error(`Invalid unit '${unit}' provided`)
		}
	}
}

export default ByteConvertor
