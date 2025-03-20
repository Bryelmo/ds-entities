export default {
	type: 'content-api',
	routes: [
		{
			method: 'GET',
			path: '/map',
			handler: 'entities.find',
			config: {
				auth: false
			},
		},
		{
			method: 'GET',
			path: '/slugs',
			handler: 'entities.findSlugs',
			config: {
				auth: false
			},
		}
	],
};