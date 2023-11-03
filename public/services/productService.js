import { ro } from '../module/userService'

const sortValidator = (val) => {
	if (val !== 'desc' || val !== 'asc')
		throw new TypeError("Property 'sort' could only be 'desc' or 'asc'.")
}

const limitAndSortDescription = {
	limit: 'Limit results. No default value, and value >= 1.',
	sort: "Sort results. Default value is in ascending mode, you can use with 'desc' or 'asc' as you want.",
}

const idDescription = {
	id: 'Identify number of product, and value >= 1.',
}

const productIdRule = ro.declareType('productIdRule', { id: 'number@1:' })

const productRules = ro.declareType('productRules', {
	title: 'string@1:20',
	price: 'number@0:',
	description: 'string@1:100',
	image: 'string',
	category: 'string',
})

const productQueryRules = ro.declareType('productQueryRules', {
	$limit: 'number@1:',
	$sort: sortValidator,
})

export default {
	route: 'products',
	api: [
		{
			name: 'getAll',
			description: 'Get all products',
			query: limitAndSortDescription,
			rules: productQueryRules,
		},
		{
			name: 'getById',
			description: 'Get a single product by id',
			param: idDescription,
			rules: productIdRule,
		},
		{
			name: 'create',
			description: 'Add new product',
			method: 'POST',
			rules: productRules,
		},
		{
			name: 'update',
			description: "Update a product's information",
			method: 'PUT',
			param: idDescription,
			rules: ro.merge(productRules, productIdRule),
		},
		{
			name: 'modify',
			description: "Update a product's information partially",
			method: 'PATCH',
			param: idDescription,
			rules: ro.merge(ro.partial(productRules), productIdRule),
		},
		{
			name: 'delete',
			description: 'Delete a product by id',
			method: 'DELETE',
			param: idDescription,
			rules: productIdRule,
		},
	],
	chirdren: [
		{
			route: 'categories',
			description: 'Get all categories',
		},
		{
			route: 'category',
			api: {
				name: 'getProductsIn',
				param: { category: 'Name of the category' },
				query: limitAndSortDescription,
				rules: ro.merge(productQueryRules, { category: 'string' }),
			},
		},
	],
}
