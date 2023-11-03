import { ro } from '../module/userService'

const union = ro.declareUnion([
	'string',
	'number',
	(value) => {
		return { result: !!value }
	},
])

export default {
	route: 'auth/login',
	namespace: 'auth',
	api: {
		name: 'login',
		method: 'POST',
		rules: {
			username: 'string',
			password: union.setProp('password'),
		},
	},
}
