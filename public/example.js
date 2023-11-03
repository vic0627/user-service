import { us } from './module/userService'
import authService from './services/authService'
import productService from './services/productService'

us.createService({
	baseURL: 'https://fakestoreapi.com/',
	namespace: 'storeAPI',
	validation: true,
	children: [productService, authService],
	beforeValidate: (payload) => {
		return JSON.stringify(payload)
	},
	onSuccess: (res) => {
		const { status, data } = res

		if (status !== 200) return null

		return data
	},
	onError: (err) => {
		alert(err.message)
	},
})
