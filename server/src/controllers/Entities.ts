export default {
	
	find: async (ctx, next) => {

		const service = strapi.plugin('ds-entities').service('entities');
		try {
			const response = await service.getMap(ctx.query);
			ctx.body = response;
		} catch (err) {
			ctx.body = err;
		}
	},
	
	findSlugs: async (ctx, next) => {

		const service = strapi.plugin('ds-entities').service('entities');
		try {
			const response = await service.getSlugMap(ctx.query);
			ctx.body = response;
		} catch (err) {
			ctx.body = err;
		}
	},

	
};
