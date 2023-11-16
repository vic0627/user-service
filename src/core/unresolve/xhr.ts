import Console from '../utils/Console'

const blankFn = (hook) => {
	return (e) => {
		console.log({ hook, e })
	}
}

const xhr = (config) => {
	const {
		method,
		url,
		header = {},
		timeout = 300000,
		responseType = '',
        payload,
		onAbort = blankFn('onAbort'),
		onError = blankFn('onError'),
		onLoad = blankFn('onLoad'),
		onLoadend = blankFn('onLoadend'),
		onLoadstart = blankFn('onLoadstart'),
		onProgress = blankFn('onProgress'),
		onReadystatechange = blankFn('onReadystatechange'),
		onTimeout = blankFn('onTimeout'),
	} = config

	const x = new XMLHttpRequest()

	x.open(method, url)

	x.timeout = timeout
	x.responseType = responseType

	for (const key in header) {
		const val = header[key]

		x.setRequestHeader(key, val)
	}

	x.onabort = onAbort
	x.onerror = onError
	x.onload = onLoad
	x.onloadend = onLoadend
	x.onloadstart = onLoadstart
	x.onprogress = onProgress
	x.onreadystatechange = onReadystatechange
	x.ontimeout = onTimeout

	x.send(payload)

	return x
}

export default class UserService {
	baseURL = ''

	constructor(baseURL) {
		if (!baseURL) Console.error('Please pass a url string to UserService.')

		this.baseURL = baseURL
	}
}
