export default {
	type: 'content-api',
	routes: [
		{
			method: 'GET',
			path: '/layout',
			handler: 'layout.find',
			config: {
				auth: false
			},
		}
	],
};