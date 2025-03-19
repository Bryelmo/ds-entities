export default {
	
	find: async (ctx, next) => {

		const service = strapi.plugin('ds-entities').service('layout');
		try {
			const response = await service.getLayout(ctx.query);
			ctx.body = response;
		} catch (err) {
			ctx.body = err;
		}
	}
};
