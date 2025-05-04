export default {
	
	find: async (ctx, next) => {

		const service = strapi.plugin('ds-entities').service('entities');
		try {
			const response = await service.getMap(ctx.query);
			ctx.body = response;
		} catch (err) {
			ctx.status = 500;
			ctx.body = {
				error: 'Internal server error',
				message: err.message,
			};
		}
	},
	
	findSlugs: async (ctx, next) => {

		const service = strapi.plugin('ds-entities').service('entities');
		try {
			const response = await service.getSlugMap(ctx.query);
			ctx.body = response;
		} catch (err) {
			ctx.status = 500;
			ctx.body = {
				error: 'Internal server error',
				message: err.message,
			};
		}
	},

	
};
